// Web Audio API Sound Synthesizer — Zero External Audio Assets Required
class SoundSystem {
  constructor() {
    this.ctx = null;
    this.enabled = typeof window !== 'undefined' ? localStorage.getItem('utk_sound_enabled') === 'true' : false;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem('utk_sound_enabled', this.enabled ? 'true' : 'false');
      window.dispatchEvent(new CustomEvent('sound-toggled', { detail: { enabled: this.enabled } }));
    }
    if (this.enabled) {
      this.play('beep');
    }
    return this.enabled;
  }

  isEnabled() {
    return this.enabled;
  }

  play(type) {
    if (!this.enabled || typeof window === 'undefined') return;
    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      switch (type) {
        case 'click':
        case 'key': {
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(1200, now);
          osc.frequency.exponentialRampToValueAtTime(120, now + 0.03);
          gain.gain.setValueAtTime(0.04, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
          osc.start(now);
          osc.stop(now + 0.03);
          break;
        }

        case 'beep':
        case 'hover': {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(880, now);
          osc.frequency.exponentialRampToValueAtTime(1760, now + 0.04);
          gain.gain.setValueAtTime(0.03, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
          osc.start(now);
          osc.stop(now + 0.04);
          break;
        }

        case 'success': {
          const notes = [523.25, 659.25, 783.99, 1046.50];
          notes.forEach((freq, idx) => {
            const o = this.ctx.createOscillator();
            const g = this.ctx.createGain();
            o.connect(g);
            g.connect(this.ctx.destination);
            o.type = 'sine';
            o.frequency.setValueAtTime(freq, now + idx * 0.06);
            g.gain.setValueAtTime(0.05, now + idx * 0.06);
            g.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.18);
            o.start(now + idx * 0.06);
            o.stop(now + idx * 0.06 + 0.2);
          });
          break;
        }

        case 'laser':
        case 'scan': {
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(1800, now);
          osc.frequency.exponentialRampToValueAtTime(300, now + 0.15);
          gain.gain.setValueAtTime(0.04, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
          osc.start(now);
          osc.stop(now + 0.15);
          break;
        }

        case 'alarm': {
          osc.type = 'square';
          osc.frequency.setValueAtTime(800, now);
          osc.frequency.setValueAtTime(400, now + 0.1);
          osc.frequency.setValueAtTime(800, now + 0.2);
          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
          osc.start(now);
          osc.stop(now + 0.3);
          break;
        }

        case 'modeSwitch': {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(440, now);
          osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
          gain.gain.setValueAtTime(0.06, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
          osc.start(now);
          osc.stop(now + 0.12);
          break;
        }

        default:
          break;
      }
    } catch (e) {}
  }
}

export const sound = new SoundSystem();
export default sound;
