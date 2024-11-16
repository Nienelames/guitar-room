class Metronome extends HTMLElement {
    #beepInterval;
    #context = new (window.AudioContext || window.webkitAudioContext)();
    #frequencies = {
        low: 880.0,
        high: 1760.0
    }
    #elements = {}
    #settings = {
        timesThrough: -1,
        playSound: false
    };
    #lastTap;


    constructor() {
        super();

        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = `
            <style>
                @import url("${window.location.origin}/css/site.min.css");
            </style>
            <div class="flex flex-col gap-4">
                <div class="flex items-center justify-between">
                    <select class="select select-bordered" id="note-type">
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4" selected>4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                        <option value="11">11</option>
                        <option value="12">12</option>
                        <option value="13">13</option>
                        <option value="14">14</option>
                        <option value="15">15</option>
                        <option value="16">16</option>
                        <option value="17">17</option>
                        <option value="18">18</option>
                        <option value="19">19</option>
                        <option value="20">20</option>
                        <option value="21">21</option>
                        <option value="22">22</option>
                        <option value="23">23</option>
                        <option value="24">24</option>
                    </select>
                    <span class="separator">/</span>
                    <select class="select select-bordered" id="beat-type">
                        <option value="2">2</option>
                        <option value="4" selected>4</option>
                        <option value="8">8</option>
                        <option value="16">16</option>
                        <option value="32">32</option>
                    </select>
                    <span id="tempo-value" class="uppercase">at 120 bpm</span>
                    <label id="beat-counter" class="label counter w-4 underline">1</label>
                </div>
                <div class="flex flex-col">
                    <label>Waveform:</label>
                    <select id="waveform" class="select select-bordered">
                        <option value="sine" selected>Sine</option>
                        <option value="square">Square</option>
                        <option value="triangle">Triangle</option>
                        <option value="sawtooth">Sawtooth</option>
                    </select>
                    <label class="label">
                        Volume:
                    </label>
                    <input id="volume" class="range" min="0" max="0.1" step="0.01" value="0.05" type="range">
                    <label class="label">
                        Tempo:
                    </label>
                    <input id="tempo" class="range" value="120" type="range" min="0" max="300" autocomplete="off">
                    <button class="btn btn-primary capitalize mt-4" id="toggle-button">Start</button>
                </div>
            </div
        `;
    }

    connectedCallback() {
        this.#elements = {
            noteType: this.shadowRoot.getElementById("note-type"),
            beatType: this.shadowRoot.getElementById("beat-type"),
            tempo: this.shadowRoot.getElementById("tempo"),
            tempoValue: this.shadowRoot.getElementById("tempo-value"),
            toggleButton: this.shadowRoot.getElementById("toggle-button"),
            beatCounter: this.shadowRoot.getElementById("beat-counter"),
            closeOptions: this.shadowRoot.getElementById("close-options"),
            options: this.shadowRoot.getElementById("options"),
            volume: this.shadowRoot.getElementById("volume"),
            waveform: this.shadowRoot.getElementById("waveform"),
            // tapButton: this.shadowRoot.getElementById("tap-button")
        };
        this.#elements.toggleButton.addEventListener('click', this.#togglePlay);
        this.#elements.beatType.addEventListener('input', this.#update);
        this.#elements.tempo.addEventListener('input', this.#updateTempoValue);
        this.#elements.tempo.addEventListener('change', () => this.#update(false));

        // this.#elements.tapButton.addEventListener('click', this.#updateTapTempo);
    }

    #updateTempoValue = () => {
        this.#elements.tempoValue.innerText = `at ${this.#elements.tempo.value} bpm`;
    }

    #togglePlay = () => {
        this.#settings.playSound = !this.#settings.playSound;
        this.#update(this.#settings.playSound);
    }

    #updateBeatCounter = () => {
        const val = this.#elements.noteType.value;
        this.#elements.beatCounter.innerText = `${(this.#settings.timesThrough % val) + 1}`;
    }

    /**
     * Updates the text of the button.
     * @param {Boolean} shouldPlaySound
     */
    #updateToggleButtonText(shouldPlaySound) {
        let buttonText = "start";

        if (shouldPlaySound) {
            buttonText = "stop";
        }

        return buttonText;
    }

    #update = (shouldPlaySound) => {
        this.#updateTempoValue();
        this.#updateBeatCounter();
        this.#elements.toggleButton.innerText = this.#updateToggleButtonText(shouldPlaySound);
        clearInterval(this.#beepInterval);

        if (shouldPlaySound) {
            // Tick once before starting the interval, to make the metronome
            // start immediately when pressing play.
            this.#tick();
            return this.#updateBeepInterval(this.#elements.tempo.value, this.#elements.beatType.value);
        }

        this.#settings.timesThrough = -1;
    }


    #updateTapTempo = () => {
        let tap = new Date();
        this.#lastTap = this.#lastTap || tap;
        let diffInMillis = Math.abs((lastTap - tap) / 1000);
        this.#lastTap = tap;
        const bpm = 60 / diffInMillis;
        
        this.#elements.tempo.value = bpm;
        
        this.#tick();
        this.#update();
        this.#updateTempoValue();
    }

    #updateBeepInterval = (tempo, beatType) => {
        if (tempo > 0) {
            const interval = parseInt(this.#bpmToMs(tempo, beatType));
            this.#beepInterval = setInterval(this.#tick, interval);
        }
    }

    #bpmToMs = (beatsPerMinute, beatType) => {
        const noteDurations = {
            1: beatsPerMinute / 4,
            2: beatsPerMinute / 2,
            4: beatsPerMinute,
            8: beatsPerMinute * 2,
            16: beatsPerMinute * 4,
            32: beatsPerMinute * 8
        };

        const milliseconds = (60000 / noteDurations[beatType]);

        return milliseconds;
    }

    #shouldBeep = (timesThrough, noteType)  => {
        return timesThrough % noteType === 0;
    }

    #tick = () => {
        this.#settings.timesThrough++;
        this.#updateBeatCounter();

        const oscillator = this.#context.createOscillator();
        const gain = this.#context.createGain();

        gain.gain.value = this.#elements.volume.value;
        oscillator.type = this.#elements.waveform.value;
        oscillator.frequency.value = this.#frequencies.low;
        oscillator.connect(gain);

        gain.connect(this.#context.destination);

        const timeToBeep = this.#shouldBeep(this.#settings.timesThrough, this.#elements.noteType.value)

        if (timeToBeep) {
            oscillator.frequency.value = this.#frequencies.high
        }

        oscillator.start();
        oscillator.stop(this.#context.currentTime + 0.1);

        if (gain.gain.value > 0) {
            gain.gain.exponentialRampToValueAtTime(0.00001, this.#context.currentTime + .10)
        }
    }
}

customElements.define("personal-metronome", Metronome);