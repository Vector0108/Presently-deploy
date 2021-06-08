import Sleno from "../Sleno/index.ts";
import { emitter } from "./websocket.ts";
import { Info, Stat } from "https://deno.land/x/sleno@2.0.0/types.ts";

class Slenosafe {
  private sleno = new Sleno("PowerPoint");

  public playing = false;
  public interval = 30;

  public info?: Info;
  public stat?: Stat;
  public timer?: number;

  async initializeSleno() {
    await this.sleno.boot().catch((error) => {
      // Since the application is already running we can just log it
      if (error === "Application is already running") console.log(error);
      // Stop the application if anything else if thrown
      else throw new Error(error);
    });
  }

  async loadFile(file: string) {
    // Pause the PowerPoint while we're loading another file
    if (this.playing) await this.setPlaying(false);

    await this.sleno.open(`powerpoint/${file}`).catch(async (error) => {
      if (error === "There is already a presentation loaded") {
        // Close the previous presentation and reattempt opening the presentation file
        await this.sleno.close();
        await this.sleno.open(`powerpoint/${file}`);
      } // Stop the application if anything else if thrown
      else throw new Error(error);
    });

    // Start the presentation
    await this.sleno.start();

    this.info = await this.sleno.info();
    this.stat = await this.sleno.stat();

    // Temporary fix to start the position at 0
    this.stat.position = this.stat.position - 1;

    // Continue playing if we paused
    if (this.playing) await this.setPlaying(true);

    // Update the clients
    emitter.emit("updateSleno");
  }

  async setPosition(position: number) {
    const slides = this.stat!.slides;
    const remainder = position % slides;

    position = remainder >= 0 ? remainder : slides + remainder;

    await this.sleno.goto(position + 1);

    // Temporary fix to start the position at 0
    this.stat = await this.sleno.stat();
    this.stat.position = this.stat.position - 1;

    // Update the clients
    emitter.emit("updateSleno");
  }

  setInterval(interval: number) {
    this.interval = interval;

    if (this.playing) {
      // Clear the previous interval and start a new one
      clearInterval(this.timer);
      this.timer = setInterval(
        this.nextIndex.bind(this),
        this.interval * 1000,
      );
    }

    // Update the clients
    emitter.emit("updateSleno");
  }

  setPlaying(playing: boolean) {
    if (playing && !this.playing) {
      // Start a timer with the new interval
      this.timer = setInterval(
        this.nextIndex.bind(this),
        this.interval * 1000,
      );
    } else if (!playing && this.playing) {
      // Stop the previous timer
      clearInterval(this.timer);
    }

    // Update the clients
    emitter.emit("updateSleno");
  }

  private async nextIndex() {
    // Fetch the latest application position
    this.stat = await this.sleno.stat();

    if (this.stat!.position < this.stat!.slides) {
      await this.setPosition(this.stat!.position);
    } else {
      await this.setPosition(0);
    }
  }
}

export default new Slenosafe();