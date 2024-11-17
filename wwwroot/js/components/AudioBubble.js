class AudioBubble extends HTMLDivElement {
    #audio = document.createElement('audio');
    #user;

    #audioControls = document.querySelector("#audio-controls");
    #muteButton = document.querySelector("#mute-button");
    #volumeSlider = document.querySelector("#volume-slider");
    
    constructor()  {
        super();
    }
    
    set user(value) {
        this.#user = value;
        
        this.#render();
    }
    
    get user() {
        return this.#user;
    }
    
    set audio(value) {
        this.#audio = value;
    }
    
    get audio() {
        return this.#audio;
    }
    
    async connectedCallback() {
        this.addEventListener("contextmenu", this.#handleAudioControlsPopup);
        this.addEventListener("touched", this.#handleAudioControlsPopup);
        this.appendChild(this.audio);
    }
    
    #render() {
        const { displayName, avatarUrl } = this.#user;
        
        this.setAttribute("data-user-id", this.#user.id);
        this.className = "flex flex-col items-center justify-center text-center card bg-base-200 shadow-xl gap-4 p-8"
        this.innerHTML = `
            <img class="w-24 h-24 rounded-full" src="${window.location.origin}${avatarUrl}" alt="Avatar">
            <figcaption>${displayName}</figcaption>
        `;
    }
    
    #handleAudioControlsPopup(event) {
        event.preventDefault();

        this.#audioControls.style.display = "flex";
        this.#audioControls.style.left = `${event.pageX}px`
        this.#audioControls.style.top = `${event.pageY}px`
        
        this.#volumeSlider.value = this.audio.volume * 100;
        this.#volumeSlider.onchange = (event) => {
            this.audio.volume = Number(event.target.value) / 100;
        }
        
        this.#updateMuteButton();
        this.#muteButton.onclick = () => {
            this.audio.muted = !this.audio.muted
            this.#updateMuteButton();
        }
    }
    
    #updateMuteButton() {
        if (this.audio.muted) {
            this.#muteButton.classList.remove("btn-error");
            this.#muteButton.classList.add("btn-success");
            this.#muteButton.textContent = "Unmute";
        } else {
            this.#muteButton.classList.remove("btn-success");
            this.#muteButton.classList.add("btn-error");
            this.#muteButton.textContent = "Mute";
        } 
    }
}

customElements.define("audio-bubble", AudioBubble, { extends: "div" });
document.addEventListener("click", (event) => {
   if (event.target.classList.contains("audio-control")) return;
   
   document.querySelector("#audio-controls").style.display = "none";
})