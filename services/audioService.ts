
import { EQ_BANDS } from '../types';

class AudioService {
  private ctx: AudioContext | null = null;
  private audio: HTMLAudioElement | null = null;
  private source: MediaElementAudioSourceNode | null = null;
  private eqFilters: BiquadFilterNode[] = [];
  private bassFilter: BiquadFilterNode | null = null;
  private analyser: AnalyserNode | null = null;
  private gainNode: GainNode | null = null;

  init() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.audio = new Audio();
    this.audio.crossOrigin = "anonymous";
    this.source = this.ctx.createMediaElementSource(this.audio);
    
    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 256;

    this.gainNode = this.ctx.createGain();
    
    // EQ Filters
    this.eqFilters = EQ_BANDS.map((freq, i) => {
      const filter = this.ctx!.createBiquadFilter();
      filter.type = 'peaking';
      filter.frequency.value = freq;
      filter.Q.value = 1;
      filter.gain.value = 0;
      return filter;
    });

    // Bass Filter
    this.bassFilter = this.ctx.createBiquadFilter();
    this.bassFilter.type = 'lowshelf';
    this.bassFilter.frequency.value = 150;
    this.bassFilter.gain.value = 0;

    // Chain: Source -> Bass -> EQ 1-N -> Gain -> Analyser -> Destination
    let lastNode: AudioNode = this.source;
    lastNode.connect(this.bassFilter);
    lastNode = this.bassFilter;

    this.eqFilters.forEach(filter => {
      lastNode.connect(filter);
      lastNode = filter;
    });

    lastNode.connect(this.gainNode);
    this.gainNode.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);
  }

  getAudio() { return this.audio; }
  getAnalyser() { return this.analyser; }

  setSrc(url: string) {
    if (!this.audio) return;
    this.audio.src = url;
  }

  play() { this.audio?.play(); }
  pause() { this.audio?.pause(); }
  
  setVolume(v: number) {
    if (this.gainNode) this.gainNode.gain.value = v;
  }

  setSpeed(s: number) {
    if (this.audio) this.audio.playbackRate = s;
  }

  setEQ(index: number, gain: number) {
    if (this.eqFilters[index]) {
      this.eqFilters[index].gain.value = gain;
    }
  }

  setBass(gain: number) {
    if (this.bassFilter) this.bassFilter.gain.value = gain;
  }

  getCurrentTime() { return this.audio?.currentTime || 0; }
  setCurrentTime(t: number) { if (this.audio) this.audio.currentTime = t; }
}

export const audioService = new AudioService();
