class AudioBubble extends HTMLDivElement {
    audio = document.createElement('audio');
    constructor()  {
        super();

        this.className = "flex flex-col items-center justify-center text-center card bg-base-200 shadow-xl gap-4 p-8"
        this.innerHTML = `
            <img class="w-24 h-24 rounded-full" src="${localStorage.getItem('avatarUrl')}" alt="Avatar">
            <figcaption>${localStorage.getItem('displayName')}</figcaption>
        `;

        this.addEventListener("contextmenu", this.#handleAudioControlsPopup);
        this.addEventListener("touched", this.#handleAudioControlsPopup);
        
        this.appendChild(this.audio);
    }
    
    #handleAudioControlsPopup(event) {
        event.preventDefault();

        const audioControlsElement = document.querySelector('#audio-controls');
        
        audioControlsElement.style.display = "flex";
        audioControlsElement.style.left = `${event.pageX}px`
        audioControlsElement.style.top = `${event.pageY}px`
        
        const volumeSlider = document.querySelector("#volume-slider");
        const muteButton = document.querySelector("#mute-button");
        
        volumeSlider.value = this.audio.volume * 100;
        volumeSlider.onchange = (event) => {
            this.audio.volume = Number(event.target.value) / 100;
        }
        muteButton.onclick = () => {
            if (!this.audio.muted) {
                this.audio.muted = true;
                
                muteButton.classList.remove("btn-error");
                muteButton.classList.add("btn-success");
                muteButton.textContent = "Unmute";
            } else {
                this.audio.muted = false;

                muteButton.classList.remove("btn-success");
                muteButton.classList.add("btn-error");
                muteButton.textContent = "Mute";
            }
        }
    }
}

customElements.define("audio-bubble", AudioBubble, { extends: "div" });
document.addEventListener("click", (event) => {
   if (event.target.classList.contains("audio-control")) return;
   
   document.querySelector("#audio-controls").style.display = "none";
})