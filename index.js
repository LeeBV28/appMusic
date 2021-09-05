const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const playlist = $('.playlist');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');




var app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: 'Rồi tới luôn',
            singer: 'Nal',
            path: './Audio/01. Roi Toi Luon - Nal.mp3',
            image:'./Images/01.jpg'
        },
        {
            name: 'Da Vu',
            singer: 'Tang Duy Tan',
            path: './Audio/02. Da Vu - Tang Duy Tan.mp3',
            image:'./Images/02.jpg'
        },
        {
            name: 'Em hat ai nghe',
            singer: 'Orange',
            path: './Audio/03. Em Hat Ai Nghe - Orange.mp3',
            image:'./Images/03.jpg'
        },
        {
            name: 'Phai nen bat dau tu dau',
            singer: 'Hoai Lam',
            path: './Audio/04. Phai Nen Bat Dau Tu Dau - Hoai Lam.mp3',
            image:'./Images/04.jpg'
        },
        {
            name: 'Xin cui dau_xin biet on',
            singer: 'Dat G',
            path: './Audio/05. Xin Cui Dau_ Xin Biet On - Dat G.mp3',
            image:'./Images/05.jpg'
        },
        {
            name: 'Sai gon dau long qua',
            singer: 'Hua kim tuyen',
            path: './Audio/06. Sai Gon Dau Long Qua - Hua Kim Tuyen_ Ho.mp3',
            image:'./Images/06.jpg'
        },
        {
            name: 'Thanh Xuan',
            singer: 'Da Lab',
            path: './Audio/07. Thanh Xuan - Da LAB.mp3',
            image:'./Images/07.jpg'
        },
        {
            name: 'Bo em vao ba lo',
            singer: 'Tan Tran',
            path: './Audio/08. Bo Em vao Balo - Tan Tran_ Freak D.mp3',
            image:'./Images/08.jpg'
        },
        {
            name: 'Thien dang',
            singer: 'Wowy',
            path: './Audio/09. Thien Dang - Wowy_JoliPoli (1).mp3',
            image:'./Images/09.jpg'
        },
        {
            name: 'Phia sau em',
            singer: 'Kay Tran',
            path: './Audio/10. Phia Sau Em - Kay Tran_ Binz.mp3',
            image:'./Images/10.jpg'
        },
        {
            name: 'Ngay chua giong bao',
            singer: 'Bui Lan Huong',
            path: './Audio/11. Ngay Chua Giong Bao - Bui Lan Huong.mp3',
            image:'./Images/11.jpg'
        }
    ],
    render: function() {
        const htmls = this.songs.map(function(song, index) {
            return `
                <div class="song" data="${index}">
                    <div class="thumb" style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        });
        playlist.innerHTML = htmls.join('');
    },
    handleEvents: function() {
        const _this = this;
        const cd = $('.cd');
        const cdWidth = cd.offsetWidth;

        // xử lý phóng to thủ nhỏ cd-thumb
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px': 0;
            cd.style.opacity = newCdWidth / cdWidth;
        };

        // Xử lý đĩa nhạc quay:
        const cdThumbAnimate = cdThumb.animate(
            [
                {transform: 'rotate(360deg)'}
            ],
            {
                duration: 10000,
                iterations: Infinity
            }
        );
        cdThumbAnimate.pause();

        // xử lý khi click play or pause
        playBtn.onclick = function() {
            if(_this.isPlaying) {
                audio.pause();
            }
            else{
                audio.play();
            }
        }

        // Lắng nghe audio đang play
        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }
        // lắng nghe audio bị pause
        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }

        // Xử lý thay đổi tiến độ bài hát:
        audio.ontimeupdate = function() {
            if(audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration *100);
                progress.value = progressPercent;
            }
        }

        // xử lý tua bài hát:
        progress.onchange = function(e) {
            const seekTime = audio.duration/100 * e.target.value;
            audio.currentTime = seekTime;
        }

        // xử lý next bài hát:
        nextBtn.onclick = function() {
            if(_this.isRandom){
                _this.randomSong();
                _this.loadCurrentSong();
                audio.play();
            }
            else{
                _this.nextSong();
            }
        }
        // xử lý khi prev bài hát:
        prevBtn.onclick = function() {
            _this.prevSong();
        }

        // Xử lý nút random:
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom;
            randomBtn.classList.toggle('active')
        }
        // Xử lý nút repeat:
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat;
            repeatBtn.classList.toggle('active');
        }

        // Xử lý khi hết bài
        audio.onended = function() {
            if(_this.isRepeat){
                audio.play();
            }
            else {
                nextBtn.click();
            }
        }

        // Xử lý khi click vào bài hát or option
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)');
            const optionNode = e.target.closest('.option');
            if(songNode && !optionNode) {
                if(songNode) {
                    _this.currentIndex = Number(songNode.getAttribute('data'));
                    _this.loadCurrentSong();
                    audio.play();
                    _this.activeSong();
                }
            }
            if(optionNode) {
                console.log('Bạn vừa bấm vào Option: Chức năng đang phát triển chưa thực hiện được')
            }
        }
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        });
    },
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`;
        audio.src = this.currentSong.path;
    },
    nextSong: function() {
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong()
        audio.play();
        this.activeSong();
        this.scrollTopActiveSong();
    },
    prevSong: function() {
        if(this.currentIndex == 0) {
            this.currentIndex = this.songs.length-1;
        }
        else {
            this.currentIndex--;
        }
        this.loadCurrentSong();
        audio.play();
        this.activeSong();
        this.scrollTopActiveSong();
    },
    randomSong: function() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while(newIndex === this.currentIndex)
        this.currentIndex = newIndex;
        this.activeSong();
    },
    activeSong: function() {
        for(var i=0; i<this.songs.length; i++){
            if(playlist.children[i].closest('.song.active')) {
                playlist.children[i].classList.remove('active')
            }
        }
        playlist.children[this.currentIndex].classList.add('active')
    },
    scrollTopActiveSong: function() {
        setTimeout(function() {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'end',
            });
        },300);        
    },
    start: function() {
        this.handleEvents();
        this.defineProperties();
        this.loadCurrentSong();
        this.render();
        this.activeSong();
    }
}
app.start();