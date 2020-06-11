// @todo: import MediaPlayer from SDK
import {Lightning, Utils, MediaPlayer} from "wpe-lightning-sdk";

export default class Player extends Lightning.Component {
    static _template() {
        return {
            MediaPlayer: { type: MediaPlayer },
            w: 1920,
            y: 900,
            Overlay: {
                x: 0,
                w: w=>w,
                h: 300,
                y: y=>y - 100,
                flexItem: {},
                rect: true,
                colorTop: 0x99404249,
                colorBottom: 0xdd03b3e4,
            },
            Controls: {
                w: w=>w,
                y: y=>y,
                flex:{ direction: 'row', padding: 20, wrap: true },
                x: 100, 
                alpha: 0,
                transitions: {
                    alpha: {duration: .6, timingFunction: 'cubic-bezier(0.20, 1.00, 0.80, 1.00)'},
                },
                PlayPause: {
                    w: 25,
                    flexItem: { margin: 10 },
                    src: Utils.asset('mediaplayer/pause.png')
                },
                Skip: {
                    w: 25,
                    flexItem: { margin: 10 },
                    src: Utils.asset('mediaplayer/skip.png')
                },
                ProgressBar: {
                    y: 8,
                    h: 10,
                    flex:{ direction: 'row', padding: 0, wrap: true },
                    flexItem: { margin: 10, minWidth: 1300 },
                    Played: {
                        flexItem: { margin: 0},
                        w: 1,
                        h: h=>h,
                        rect: true,
                        color : 0xFFFFFFFF,
                        alpha: 1,
                    },
                    Total: {
                        flexItem: { margin: 0},
                        w: 1299,
                        h: h=>h,
                        rect: true,
                        color : 0xFFFFFFFF,
                        alpha: 0.5,
                    }
                },
                Times: {
                    y: -8,
                    w: 400,
                    flex:{ direction: 'row', padding: 0, wrap: true },
                    flexItem: { margin: 10 },
                    CurrentTime: {
                        flexItem: { marginRight: 20 },
                        text: {
                            color : 0xFFFFFFFF,
                            text: '--',
                            fontSize: 26, 
                            fontFace: "SourceSansPro-Regular"
                        }
                    },
                    Splitter: {
                        flexItem: {},
                        text: {
                            color : 0xFFFFFFFF,
                            text: '/',
                            fontSize: 30, 
                            fontFace: "SourceSansPro-Regular"
                        }
                    },
                    TotalTime: {
                        flexItem: { marginLeft: 20 },
                        text: {
                            color : 0xFFFFFFFF,
                            text: '--',
                            fontSize: 26, 
                            fontFace: "SourceSansPro-Regular"
                        }
                    }
                }
            }
            

            /**
             * @todo:
             * - Add MediaPlayer component (that you've imported via SDK)
             * - Add a rectangle overlay with gradient color to the bottom of the screen
             * - Add A Controls:{} Wrapper that hosts the following components:
             *   - PlayPause button image (see static/mediaplayer folder)
             *   - A skip button (see static/mediaplayer folder)
             *   - Progress bar (2 rectangles?)
             *   - add duration label
             *   - add text label for currentTime
             */
        };
    }

    _init() {
        /**
         * @todo:
         * tag MediaPlayer component and set correct consumer
         */
        this.tag('MediaPlayer').updateSettings({consumer: this});
    }

    /**
     *@todo:
     * add focus and unfocus handlers
     * focus => show controls
     * unfocus => hide controls
     */

    _focus() {
        this.tag("Controls").patch({
            smooth: {
                alpha: 1
            }
        });
    }

    _unfocus() {
        this.tag("Controls").patch({
            smooth: {
                alpha: 0
            }
        });
    }

    _getFocused() {
        return this.tag("MediaPlayer");
    }

    _active() {
        this.play(this._item.stream);
    }

    /**
     * @todo:
     * When your App is in Main state, call this method
     * and play the video loop (also looped)
     * @param src
     * @param loop
     */
    play(src, loop) {
        this.tag("MediaPlayer").loop = loop;

        if (src) {
            this.tag('MediaPlayer').open(src);
        }

        this.tag("MediaPlayer").doPlay();
    }

    stop() {
        this.tag("MediaPlayer").doPause();
    }

    set item(v){
        this._item = v;
    }

    /**
     * @todo:
     * - add _handleEnter() method and make sure the video Pauses
     */
    _handleEnter(){
        this.stop();
        this._setState('Paused');
    }

    /**
     * This will be automatically called when the mediaplayer pause event is triggerd
     * @todo:
     * - Add this Component in a Paused state
     */
    $mediaplayerPause() {
        console.log('video is paused');
        this._setState('Paused')
    }

    $mediaplayerPlay() {
        console.log('video is playing');
        this._setState('Playing')
    }

    $mediaplayerProgress(playerInfo) {
        console.log('video is being played');
        const _videoPercentage = playerInfo.currentTime / playerInfo.duration;
        const _fullWidth = 1300;
        const _currTime = Math.round(playerInfo.currentTime);

        this.tag("ProgressBar").patch(
            {
                Played: {
                    w: _videoPercentage * _fullWidth
                },
                Total: {
                    w: _fullWidth * (1 - _videoPercentage)
                }
            }
        );

        this.tag("CurrentTime").patch({
            text: {
                text: _currTime
            }
        });

        this.tag("TotalTime").patch({
            text: {
                text: playerInfo.duration
            }
        });
    }

    static _states(){
        return [
            /**
             * @todo:
             * - Add paused state
             * - on enter change the play to pause button (see static/mediaplayer folder)
             * - on _handleEnter() play the asset again
             * - reset state on play
             */
            class Paused extends this{
                $enter(){
                    this.tag("PlayPause").src = Utils.asset("mediaplayer/play.png");
                }
                _handleEnter(){
                    this.play();
                }
            },
            class Playing extends this{
                $enter(){
                    this.tag("PlayPause").src = Utils.asset("mediaplayer/pause.png");
                }
                _handleEnter(){
                    this.stop();
                }
            },
        ]
    }
}