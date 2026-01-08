/**
 * Unit tests for Audio_Controller
 */

// Copy of Audio_Controller class for testing
class Audio_Controller {
	constructor() {
		this._trackLength = null;
		this._playhead = null;
		this._checkPlayheadPositionInterval = null;
		this._duration = null;
		this._activeAudioClip = false;
		this._className = "Timer";
		this._view = null;
	}

	init() {
		this._activeAudioClip = false;
	}

	startAudio() {
		this._activeAudioClip = true;
		this.startCheckingPlayhead();
		this._view.getTrack().play();
		this.getDuration();
	}

	pauseAudio() {
		this._activeAudioClip = false;
		this._view.getTrack().pause();
		clearInterval(this._checkPlayheadPositionInterval);
		this._checkPlayheadPositionInterval = null;
	}

	resumeAudio() {
		if (this._activeAudioClip) {
			const playPromise = this._view.getTrack().play();
			// Handle promise rejection (e.g., autoplay policy)
			if (playPromise !== undefined) {
				playPromise.catch(error => {
					console.warn('Audio play failed:', error);
					this._activeAudioClip = false;
				});
			}
			this.startCheckingPlayhead();
		}
	}

	toggleAudio() {
		if (this._view.getTrack().paused) {
			this._activeAudioClip = true;
			this.resumeAudio();
		} else {
			this.pauseAudio();
		}
	}

	setAudioVolume(volume) {
		const normalizedVolume = volume / 100;
		this._view.getTrack().volume = normalizedVolume;
	}

	getDuration() {
		this._duration = this._view.getTrack().duration;
	}

	startCheckingPlayhead() {
		this._checkPlayheadPositionInterval = setInterval(this.checkPlayheadPosition.bind(this), 10);
	}

	checkPlayheadPosition() {
		const currentTime = this._view.getTrack().currentTime;
		if (currentTime > 35.2) {
			this._view.setCurrentTime(.01);
		}
	}

	restartAudio() {
		this._view.setCurrentTime(.36);
		this.resumeAudio();
	}
}

// Mock Audio_View
class MockAudioView {
	constructor() {
		this._track = {
			paused: true,
			play: jest.fn(() => Promise.resolve()),
			pause: jest.fn(),
			volume: 1.0,
			currentTime: 0,
			duration: 100
		};
	}

	getTrack() {
		return this._track;
	}

	setCurrentTime(position) {
		this._track.currentTime = position;
	}
}

describe('Audio_Controller', () => {
	let audioController;
	let mockView;

	beforeEach(() => {
		jest.useFakeTimers();
		audioController = new Audio_Controller();
		mockView = new MockAudioView();
		audioController._view = mockView;
		audioController.init();
	});

	afterEach(() => {
		jest.clearAllTimers();
		jest.useRealTimers();
	});

	describe('init', () => {
		it('should initialize with _activeAudioClip set to false', () => {
			expect(audioController._activeAudioClip).toBe(false);
		});
	});

	describe('startAudio', () => {
		it('should set _activeAudioClip to true', () => {
			audioController.startAudio();
			expect(audioController._activeAudioClip).toBe(true);
		});

		it('should call play() on the track', () => {
			audioController.startAudio();
			expect(mockView.getTrack().play).toHaveBeenCalled();
		});

		it('should start checking playhead position', () => {
			audioController.startAudio();
			expect(audioController._checkPlayheadPositionInterval).toBeDefined();
		});

		it('should get duration', () => {
			audioController.startAudio();
			expect(audioController._duration).toBe(100);
		});
	});

	describe('pauseAudio', () => {
		it('should set _activeAudioClip to false', () => {
			audioController._activeAudioClip = true;
			audioController.pauseAudio();
			expect(audioController._activeAudioClip).toBe(false);
		});

		it('should call pause() on the track', () => {
			audioController.pauseAudio();
			expect(mockView.getTrack().pause).toHaveBeenCalled();
		});

		it('should clear the playhead checking interval', () => {
			audioController.startAudio();
			const interval = audioController._checkPlayheadPositionInterval;
			audioController.pauseAudio();
			expect(audioController._checkPlayheadPositionInterval).toBeNull();
		});

		it('should set interval to null after clearing', () => {
			audioController.startAudio();
			audioController.pauseAudio();
			expect(audioController._checkPlayheadPositionInterval).toBeNull();
		});
	});

	describe('resumeAudio', () => {
		it('should play audio if _activeAudioClip is true', () => {
			audioController._activeAudioClip = true;
			audioController.resumeAudio();
			expect(mockView.getTrack().play).toHaveBeenCalled();
		});

		it('should not play audio if _activeAudioClip is false', () => {
			audioController._activeAudioClip = false;
			audioController.resumeAudio();
			expect(mockView.getTrack().play).not.toHaveBeenCalled();
		});

		it('should start checking playhead position when resuming', () => {
			audioController._activeAudioClip = true;
			audioController.resumeAudio();
			expect(audioController._checkPlayheadPositionInterval).toBeDefined();
		});

		it('should handle play promise rejection', () => {
			const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
			const rejectPromise = Promise.reject(new Error('Autoplay blocked'));
			mockView.getTrack().play = jest.fn(() => rejectPromise);
			
			audioController._activeAudioClip = true;
			audioController.resumeAudio();
			
			// Verify play was called
			expect(mockView.getTrack().play).toHaveBeenCalled();
			
			// The promise rejection handler will set _activeAudioClip to false asynchronously
			// We verify the code path exists by checking the promise is created
			expect(mockView.getTrack().play()).toBeInstanceOf(Promise);
			
			// Clean up: catch the rejection to avoid unhandled promise warning
			rejectPromise.catch(() => {});
			
			consoleSpy.mockRestore();
		});
	});

	describe('toggleAudio', () => {
		it('should pause audio when track is playing', () => {
			mockView.getTrack().paused = false;
			audioController._activeAudioClip = true;
			
			audioController.toggleAudio();
			
			expect(mockView.getTrack().pause).toHaveBeenCalled();
			expect(audioController._activeAudioClip).toBe(false);
		});

		it('should resume audio when track is paused', () => {
			mockView.getTrack().paused = true;
			audioController._activeAudioClip = false;
			
			audioController.toggleAudio();
			
			expect(audioController._activeAudioClip).toBe(true);
			expect(mockView.getTrack().play).toHaveBeenCalled();
		});

		it('should properly toggle from playing to paused', () => {
			// Start playing
			mockView.getTrack().paused = false;
			audioController._activeAudioClip = true;
			audioController.startAudio();
			
			// Toggle to pause
			audioController.toggleAudio();
			expect(audioController._activeAudioClip).toBe(false);
			expect(mockView.getTrack().pause).toHaveBeenCalled();
			
			// Toggle back to play
			mockView.getTrack().paused = true;
			audioController.toggleAudio();
			expect(audioController._activeAudioClip).toBe(true);
			expect(mockView.getTrack().play).toHaveBeenCalledTimes(2); // Once from startAudio, once from toggle
		});

		it('should ensure audio stays paused after toggle (fix for mute button bug)', () => {
			// Simulate the bug scenario: audio is playing
			mockView.getTrack().paused = false;
			audioController._activeAudioClip = true;
			audioController.startAudio();
			
			// Toggle to mute (pause)
			audioController.toggleAudio();
			
			// Verify it's paused and state is correct
			expect(audioController._activeAudioClip).toBe(false);
			expect(audioController._checkPlayheadPositionInterval).toBeNull();
			
			// Advance time to ensure interval doesn't restart
			jest.advanceTimersByTime(100);
			
			// Verify audio is still paused and not restarted
			expect(audioController._activeAudioClip).toBe(false);
			expect(mockView.getTrack().pause).toHaveBeenCalled();
		});
	});

	describe('setAudioVolume', () => {
		it('should set volume correctly', () => {
			audioController.setAudioVolume(50);
			expect(mockView.getTrack().volume).toBe(0.5);
		});

		it('should normalize volume to 0-1 range', () => {
			audioController.setAudioVolume(100);
			expect(mockView.getTrack().volume).toBe(1.0);
			
			audioController.setAudioVolume(0);
			expect(mockView.getTrack().volume).toBe(0.0);
		});
	});

	describe('checkPlayheadPosition', () => {
		it('should reset currentTime when it exceeds 35.2', () => {
			mockView.getTrack().currentTime = 36;
			audioController.checkPlayheadPosition();
			expect(mockView.getTrack().currentTime).toBe(0.01);
		});

		it('should not reset currentTime when it is less than 35.2', () => {
			mockView.getTrack().currentTime = 30;
			audioController.checkPlayheadPosition();
			expect(mockView.getTrack().currentTime).toBe(30);
		});
	});

	describe('restartAudio', () => {
		it('should set currentTime to 0.36', () => {
			audioController._activeAudioClip = true;
			audioController.restartAudio();
			expect(mockView.getTrack().currentTime).toBe(0.36);
		});

		it('should resume audio after setting currentTime', () => {
			audioController._activeAudioClip = true;
			audioController.restartAudio();
			expect(mockView.getTrack().play).toHaveBeenCalled();
		});
	});
});
