/*
CustomAudio (npf + legacy Tumblr posts)
-  https://lushwave.tumblr.com
-  https://github.com/flipsewtf/
-  Version 1.0.0
*/
document.addEventListener("DOMContentLoaded", function () {
    const playSVG =
            "<svg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 24 24' fill='currentColor' class='play-audio'><path d='M6 4v16a1 1 0 0 0 1.524.852l13-8a1 1 0 0 0 0-1.704l-13-8A1 1 0 0 0 6 4z'></path></svg>",
        pauseSVG =
            "<svg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 24 24' fill='currentColor' class='pause-audio'><path d='M9 4h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h2a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2z'/><path d='M17 4h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h2a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2z'/></svg>",

        handleAudioPosts = () => {
            document.querySelectorAll(".tmblr-full").forEach((post) => {
                const caption = post.querySelector(".audio-caption"),
                    audio = post.querySelector("audio"),
                    nativePlayer = post.querySelector(".audio_player");
                
                //handle npf audio posts
                if (caption && audio && !audio.dataset.handled) {
                    audio.dataset.handled = true; 
                    audio.style.display = "none"; 

                    // Create custom audio player
                    const customPlayer = document.createElement("div");
                    customPlayer.classList.add("custom-audio-player");
                    customPlayer.innerHTML = `<button class="play-pause">${ playSVG }</button>`;

                    // Insert custom player at the top of the caption
                    caption.insertBefore(customPlayer, caption.firstChild);

                    const playPauseButton = customPlayer.querySelector(".play-pause");
                    playPauseButton.addEventListener("click", () => {
                        audio.paused
                            ? (audio.play(), (playPauseButton.innerHTML = pauseSVG))
                            : (audio.pause(), (playPauseButton.innerHTML = playSVG));
                    });

                    audio.addEventListener("play", () => {
                        playPauseButton.innerHTML = pauseSVG;
                    });
                    audio.addEventListener("pause", () => {
                        playPauseButton.innerHTML = playSVG;
                    });
                }

                // handle legacy audio posts
                if (caption && nativePlayer && !nativePlayer.dataset.handled) {
                    nativePlayer.dataset.handled = true;
                    nativePlayer.style.display = "none";

                    const audioSrc = nativePlayer.querySelector("iframe").src;
                    const legacyAudio = document.createElement("audio");
                    legacyAudio.src = getAudioSource(audioSrc);

                    const customPlayer = document.createElement("div");
                    customPlayer.classList.add("custom-audio-player");
                    customPlayer.innerHTML = `<button class="play-pause">${ playSVG }</button>`;

                    caption.insertBefore(customPlayer, caption.firstChild);

                    const playPauseButton = customPlayer.querySelector(".play-pause");
                    playPauseButton.addEventListener("click", () => {
                        legacyAudio.paused
                            ? (legacyAudio.play(), (playPauseButton.innerHTML = pauseSVG))
                            : (legacyAudio.pause(), (playPauseButton.innerHTML = playSVG));
                    });
                    
                    legacyAudio.addEventListener("play", () => {
                        playPauseButton.innerHTML = pauseSVG;
                    });
                    legacyAudio.addEventListener("pause", () => {
                        playPauseButton.innerHTML = playSVG;
                    });
                    legacyAudio.addEventListener("ended", () => {
                        playPauseButton.innerHTML = playSVG;
                    });
                }
            });
        };
        
    const getAudioSource = (src) => {
        let audioSrc = decodeURIComponent(src).split("audio_file=")[1].split("&color=")[0];
        return (
            audioSrc.includes(".mp3") || (audioSrc = "https://a.tumblr.com/" + audioSrc.split("/").pop() + "o1.mp3"),
            audioSrc
        );
    };

    handleAudioPosts();

    const observer = new MutationObserver(() => {
        handleAudioPosts();
    });
    observer.observe(document.body, { childList: true, subtree: true });
});

