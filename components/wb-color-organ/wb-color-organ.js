/**
 * WB Color Organ Component
 * Audio-reactive full-screen color visualization system
 * Integrates with wb-control-panel and WBColorHarmony
 * NOW USES SHARED wb-color-utils FOR AUDIO ANALYSIS
 * Version: 2.0.0
 */

class WBColorOrgan extends HTMLElement {
    constructor() {
        super();
        
        // State management
        this.state = {
            enabled: false,
            mode: 'blocks', // 'blocks', 'gradient', 'pulse', 'wave', 'cracked-ice', 'laser'
            colorCount: 8,
            harmonyMode: 'complementary',
            baseHue: 240,
            saturation: 70,
            lightness: 50,
            audioData: {
                bass: 0,
                mids: 0,
                treble: 0
            }
        };
        
        // Light sources for cracked ice mode
        this.lightSources = [];
        this.lightAnimationFrame = null;
        
        // Laser beams for laser mode
        this.laserBeams = [];
        this.laserAnimationFrame = null;
        this.laserMirrorPositions = []; // Mirror positions for movement
        
        // Animation frame ID
        this.animationFrame = null;
        
        // Color harmony system
        this.harmonySystem = null;
        
        // Event handlers (for cleanup)
        this.handlers = {
            toggle: null,
            audioData: null,
            colorBeat: null,
            colorChange: null
        };
    }
    
    connectedCallback() {
        console.log('🎵 WB Color Organ: Connected to DOM');
        
        // Load CSS
        this.loadCSS();
        
        // Initialize
        this.init();
    }
    
    disconnectedCallback() {
        console.log('🎵 WB Color Organ: Disconnecting - cleaning up');
        
        // Stop animations
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
        
        if (this.lightAnimationFrame) {
            cancelAnimationFrame(this.lightAnimationFrame);
            this.lightAnimationFrame = null;
        }
        
        if (this.laserAnimationFrame) {
            cancelAnimationFrame(this.laserAnimationFrame);
            this.laserAnimationFrame = null;
        }
        
        // Remove event listeners
        Object.keys(this.handlers).forEach(key => {
            if (this.handlers[key]) {
                document.removeEventListener(this.handlers[key].event, this.handlers[key].callback);
            }
        });
        
        console.log('✅ WB Color Organ: Cleanup complete');
    }
    
    loadCSS() {
        // Check if CSS already loaded
        if (document.getElementById('wb-color-organ-styles')) {
            return;
        }
        
        const link = document.createElement('link');
        link.id = 'wb-color-organ-styles';
        link.rel = 'stylesheet';
        link.href = '../../styles/wb-color-organ.css';
        document.head.appendChild(link);
        
        console.log('✅ WB Color Organ: CSS loaded');
    }
    
    async init() {
        // Load color harmony system
        await this.loadColorHarmonySystem();
        
        // Create HTML structure
        this.createHTML();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Apply initial settings
        this.applyInitialSettings();
        
        // Dispatch ready event
        document.dispatchEvent(new CustomEvent('wb:color-organ-ready', {
            detail: { component: this },
            bubbles: true
        }));
        
        console.log('✅ WB Color Organ: Initialized');
    }
    
    async loadColorHarmonySystem() {
        if (window.WBColorHarmony) {
            this.harmonySystem = new window.WBColorHarmony();
            console.log('✅ WB Color Organ: Color harmony system loaded');
        } else {
            console.warn('⚠️ WBColorHarmony not found - using basic complementary colors');
        }
    }
    
    createHTML() {
        this.innerHTML = `
            <div class="wb-color-organ" id="color-organ-container">
                <div class="wb-color-organ-grid" id="color-organ-grid">
                    <!-- Color blocks will be generated here -->
                </div>
                <div class="wb-color-organ-controls">
                    <button class="wb-color-organ-close" id="close-btn" title="Close (ESC)">×</button>
                    <div class="wb-color-organ-info">
                        <span class="wb-color-organ-mode" id="mode-indicator">Blocks Mode</span>
                        <span class="wb-color-organ-audio">
                            <span class="audio-level bass" id="bass-level"></span>
                            <span class="audio-level mids" id="mids-level"></span>
                            <span class="audio-level treble" id="treble-level"></span>
                        </span>
                    </div>
                </div>
            </div>
        `;
        
        // Generate initial color blocks
        this.generateColorBlocks();
    }
    
    generateColorBlocks() {
        const grid = this.querySelector('#color-organ-grid');
        if (!grid) return;
        
        grid.innerHTML = '';
        
        // Use cracked ice mode if selected
        if (this.state.mode === 'cracked-ice') {
            this.generateCrackedIceShards();
            return;
        }
        
        // Use laser mode if selected
        if (this.state.mode === 'laser') {
            this.generateLaserBeams();
            return;
        }
        
        const colors = this.generateHarmonyColors();
        
        colors.forEach((color, index) => {
            const block = document.createElement('div');
            block.className = 'wb-color-organ-block';
            block.id = `color-block-${index}`;
            block.style.backgroundColor = color.hsl;
            block.setAttribute('data-hue', color.hue);
            block.setAttribute('data-index', index);
            
            // Add hue label
            const label = document.createElement('span');
            label.className = 'wb-color-organ-label';
            label.textContent = `${Math.round(color.hue)}°`;
            block.appendChild(label);
            
            grid.appendChild(block);
        });
        
        console.log(`🎨 Generated ${colors.length} color blocks`);
    }
    
    generateCrackedIceShards() {
        const grid = this.querySelector('#color-organ-grid');
        if (!grid) return;
        
        grid.innerHTML = '';
        grid.classList.add('cracked-ice-mode');
        
        const colors = this.generateHarmonyColors();
        
        // Generate 500 small dancing lights - NO large shards in cracked ice mode
        this.generateLightSources(500, colors);
        
        console.log(`✨ Generated ${this.lightSources.length} dancing lights (Cracked Ice Mode)`);
    }
    
    generateLaserBeams() {
        const grid = this.querySelector('#color-organ-grid');
        if (!grid) return;
        
        grid.innerHTML = '';
        grid.classList.add('laser-mode');
        
        // Generate LOTS of colors across the spectrum
        const colors = [];
        for (let i = 0; i < 12; i++) {
            const hue = (i * 30) % 360; // 12 colors, 30° apart
            colors.push({
                hue: hue,
                saturation: 100,
                lightness: 50
            });
        }
        
        const circleCount = 100; // 100 spiraling circles
        
        this.laserBeams = [];
        this.laserMirrorPositions = [];
        
        for (let i = 0; i < circleCount; i++) {
            const circle = document.createElement('div');
            circle.className = 'wb-laser-beam wb-spiral-circle';
            circle.id = `laser-${i}`;
            
            // Assign color from rainbow spectrum
            const colorIndex = i % colors.length;
            const color = colors[colorIndex];
            
            // Spiral parameters
            const spiralIndex = i / circleCount; // 0 to 1
            const angle = spiralIndex * Math.PI * 8; // Multiple rotations
            const radius = 20 + (spiralIndex * 40); // Growing radius
            
            // Circle size varies
            const size = 30 + Math.random() * 100;
            
            // Position in spiral
            const centerX = 50; // Center of screen
            const centerY = 50;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            
            // Frequency band (which frequency drives this circle)
            const frequencyBand = i % 3;
            
            // Random phase offset for movement variation
            const phaseOffset = Math.random() * Math.PI * 2;
            
            // Rotation speed
            const rotationSpeed = 0.5 + Math.random() * 1.5;
            const spiralSpeed = 0.3 + Math.random() * 0.7;
            
            // Style the circle
            circle.style.position = 'absolute';
            circle.style.left = `${x}%`;
            circle.style.top = `${y}%`;
            circle.style.width = `${size}px`;
            circle.style.height = `${size}px`;
            circle.style.borderRadius = '50%';
            circle.style.transform = 'translate(-50%, -50%)';
            circle.style.pointerEvents = 'none';
            
            // Initial color
            const brightColor = `hsl(${color.hue}, 100%, 50%)`;
            circle.style.background = `radial-gradient(circle at center, 
                hsl(${color.hue}, 100%, 70%) 0%,
                hsl(${color.hue}, 100%, 50%) 40%,
                hsl(${color.hue}, 80%, 30%) 100%
            )`;
            
            // Glow effect
            circle.style.boxShadow = `
                0 0 20px hsla(${color.hue}, 100%, 50%, 0.8),
                0 0 40px hsla(${color.hue}, 100%, 50%, 0.6),
                0 0 60px hsla(${color.hue}, 100%, 50%, 0.4)
            `;
            
            circle.style.opacity = '0.7';
            circle.style.mixBlendMode = 'screen'; // Additive blending for glow
            
            // Store circle data
            const circleData = {
                element: circle,
                hue: color.hue,
                saturation: color.saturation,
                lightness: color.lightness,
                frequencyBand: frequencyBand,
                phaseOffset: phaseOffset,
                baseAngle: angle,
                baseRadius: radius,
                baseSize: size,
                centerX: centerX,
                centerY: centerY,
                spiralIndex: spiralIndex
            };
            
            // Store animation data
            const animData = {
                rotationSpeed: rotationSpeed,
                spiralSpeed: spiralSpeed,
                currentAngle: angle,
                currentRadius: radius,
                phaseOffset: phaseOffset
            };
            
            this.laserBeams.push(circleData);
            this.laserMirrorPositions.push(animData);
            grid.appendChild(circle);
        }
        
        // Start laser animation
        this.startLaserAnimation();
        
        console.log(`🌀 Generated ${this.laserBeams.length} spiraling circles with rainbow colors (SPIRAL MODE)`);
    }
    
    startLaserAnimation() {
        // Stop existing animation
        if (this.laserAnimationFrame) {
            cancelAnimationFrame(this.laserAnimationFrame);
        }
        
        const animateLasers = () => {
            if (!this.state.enabled || this.state.mode !== 'laser') {
                return;
            }
            
            const time = Date.now() * 0.001;
            const audioEnergy = (this.state.audioData.bass + this.state.audioData.mids + this.state.audioData.treble) / 3;
            
            // IMPORTANT: Only move if there's actual audio!
            const hasAudio = audioEnergy > 0.01;
            
            this.laserBeams.forEach((circle, index) => {
                const anim = this.laserMirrorPositions[index];
                
                // Get frequency response
                let audioResponse = 0;
                if (circle.frequencyBand === 0) {
                    audioResponse = this.state.audioData.bass;
                } else if (circle.frequencyBand === 1) {
                    audioResponse = this.state.audioData.mids;
                } else {
                    audioResponse = this.state.audioData.treble;
                }
                
                // SPIRAL ROTATION: Circles rotate around center
                if (hasAudio) {
                    // Audio-driven spiral rotation
                    anim.currentAngle = circle.baseAngle + (time * anim.rotationSpeed) + (audioResponse * Math.PI);
                    
                    // Radius pulses with music
                    const radiusPulse = audioResponse * 15;
                    anim.currentRadius = circle.baseRadius + radiusPulse;
                } else {
                    // Gentle rotation without music
                    anim.currentAngle = circle.baseAngle + (time * 0.5);
                    anim.currentRadius = circle.baseRadius;
                }
                
                // Calculate new position
                const x = circle.centerX + Math.cos(anim.currentAngle) * anim.currentRadius;
                const y = circle.centerY + Math.sin(anim.currentAngle) * anim.currentRadius;
                
                circle.element.style.left = `${x}%`;
                circle.element.style.top = `${y}%`;
                
                // HUE SHIFTS: Rainbow color cycling
                const hueShift = hasAudio ? (audioResponse * 60) : (time * 20);
                const newHue = (circle.hue + hueShift) % 360;
                
                // SIZE PULSING: Grow/shrink with audio
                const sizePulse = hasAudio ? (audioResponse * 50) : 0;
                const newSize = circle.baseSize + sizePulse;
                circle.element.style.width = `${newSize}px`;
                circle.element.style.height = `${newSize}px`;
                
                // BRIGHTNESS: Extra bright on audio
                const brightness = hasAudio ? (50 + (audioResponse * 40)) : 50;
                
                // Update colors
                circle.element.style.background = `radial-gradient(circle at center, 
                    hsl(${newHue}, 100%, ${brightness + 20}%) 0%,
                    hsl(${newHue}, 100%, ${brightness}%) 40%,
                    hsl(${newHue}, 80%, ${brightness - 20}%) 100%
                )`;
                
                // GLOW: Intense with music
                if (hasAudio) {
                    const glowSize = 20 + (audioResponse * 40);
                    circle.element.style.boxShadow = `
                        0 0 ${glowSize}px hsla(${newHue}, 100%, 50%, ${audioResponse}),
                        0 0 ${glowSize * 2}px hsla(${newHue}, 100%, 50%, ${audioResponse * 0.7}),
                        0 0 ${glowSize * 3}px hsla(${newHue}, 100%, 50%, ${audioResponse * 0.5}),
                        0 0 ${glowSize * 4}px hsla(${newHue}, 80%, 40%, ${audioResponse * 0.3})
                    `;
                    
                    // OPACITY: Flicker with audio
                    circle.element.style.opacity = 0.6 + (audioResponse * 0.4);
                    
                    // Beat pulse
                    if (audioResponse > 0.8) {
                        circle.element.style.transform = `translate(-50%, -50%) scale(${1.2 + audioResponse * 0.3})`;
                    } else {
                        circle.element.style.transform = 'translate(-50%, -50%) scale(1)';
                    }
                } else {
                    // Static glow without music
                    circle.element.style.boxShadow = `
                        0 0 20px hsla(${newHue}, 100%, 50%, 0.5),
                        0 0 40px hsla(${newHue}, 100%, 50%, 0.3)
                    `;
                    circle.element.style.opacity = '0.7';
                    circle.element.style.transform = 'translate(-50%, -50%) scale(1)';
                }
            });
            
            this.laserAnimationFrame = requestAnimationFrame(animateLasers);
        };
        
        animateLasers();
    }
    
    generateLightSources(count, colors) {
        const grid = this.querySelector('#color-organ-grid');
        if (!grid) return;
        
        // Clear existing lights
        this.lightSources = [];
        
        for (let i = 0; i < count; i++) {
            const light = document.createElement('div');
            light.className = 'wb-light-source';
            light.id = `light-${i}`;
            
            // Random positioning
            const left = Math.random() * 100;
            const top = Math.random() * 100;
            
            // Slightly larger lights for better visibility (3-10px)
            const size = 3 + Math.random() * 7;
            
            // Assign color from palette
            const colorIndex = Math.floor(Math.random() * colors.length);
            const color = colors[colorIndex];
            
            // ALL lights dance to music - no independent blink rates
            // Each light responds to one of the three frequency bands
            const frequencyBand = i % 3; // 0=bass, 1=mids, 2=treble
            
            // Random phase offset for slight variation
            const phaseOffset = Math.random() * Math.PI * 2;
            
            // Higher base intensity for brighter lights (0.7-1.0)
            const baseIntensity = 0.7 + Math.random() * 0.3;
            
            // Apply styles
            light.style.left = `${left}%`;
            light.style.top = `${top}%`;
            light.style.width = `${size}px`;
            light.style.height = `${size}px`;
            light.style.backgroundColor = color.hsl;
            light.style.opacity = baseIntensity;
            
            // Store metadata
            const lightData = {
                element: light,
                hue: color.hue,
                saturation: color.saturation,
                lightness: color.lightness,
                frequencyBand: frequencyBand,
                phaseOffset: phaseOffset,
                baseIntensity: baseIntensity,
                size: size,
                colorIndex: colorIndex
            };
            
            this.lightSources.push(lightData);
            grid.appendChild(light);
        }
        
        // Start light animation loop
        this.startLightAnimation();
    }
    
    startLightAnimation() {
        // Stop existing animation
        if (this.lightAnimationFrame) {
            cancelAnimationFrame(this.lightAnimationFrame);
        }
        
        const animateLights = () => {
            if (!this.state.enabled || this.state.mode !== 'cracked-ice') {
                return;
            }
            
            const time = Date.now() * 0.001;
            
            // SUPER REACTIVE: Calculate overall audio energy
            const audioEnergy = (this.state.audioData.bass + this.state.audioData.mids + this.state.audioData.treble) / 3;
            
            this.lightSources.forEach((light, index) => {
                // Determine which frequency band this light responds to
                let audioResponse = 0;
                if (light.frequencyBand === 0) {
                    audioResponse = this.state.audioData.bass;
                } else if (light.frequencyBand === 1) {
                    audioResponse = this.state.audioData.mids;
                } else {
                    audioResponse = this.state.audioData.treble;
                }
                
                // INSTANT RESPONSE: No smoothing, pure audio
                // Add slight phase for organic feel but keep it tight
                const quickPhase = Math.sin(time * 4 + light.phaseOffset) * 0.1;
                const phasedResponse = audioResponse * (0.95 + quickPhase);
                
                // SUPER BRIGHT: Dramatic intensity changes
                // Range: 0.2 to 1.0 for maximum contrast
                const intensity = Math.max(0.2, Math.min(1.0, 
                    0.3 + (phasedResponse * 0.7) + (audioEnergy * 0.3)
                ));
                
                light.element.style.opacity = intensity;
                
                // HUGE SCALE CHANGES: Up to 2.5x on peaks!
                const scale = 1 + (phasedResponse * 1.5) + (audioEnergy * 0.5);
                light.element.style.transform = `scale(${scale})`;
                
                // EXTREME COLOR SHIFTS: Maximum visual drama
                const hueShift = this.state.audioData.bass * 60;
                const newHue = (light.hue + hueShift) % 360;
                
                const satBoost = this.state.audioData.mids * 40;
                const newSat = Math.min(100, light.saturation + satBoost);
                
                const lightShift = this.state.audioData.treble * 35;
                const newLight = Math.max(40, Math.min(98, light.lightness + lightShift));
                
                light.element.style.backgroundColor = `hsl(${newHue}, ${newSat}%, ${newLight}%)`;
                
                // MASSIVE GLOW: Up to 20px base + energy boost
                const baseGlow = phasedResponse * 20;
                const energyGlow = audioEnergy * 10;
                const totalGlow = baseGlow + energyGlow;
                
                const glowColor = `hsla(${newHue}, ${newSat}%, ${newLight}%, ${phasedResponse})`;
                const strongGlow = `hsla(${newHue}, 100%, 70%, ${phasedResponse * 0.9})`;
                
                // Triple-layer ultra-bright glow
                light.element.style.boxShadow = `
                    0 0 ${totalGlow}px ${strongGlow},
                    0 0 ${totalGlow * 2}px ${glowColor},
                    0 0 ${totalGlow * 3}px ${glowColor},
                    0 0 ${totalGlow * 4}px hsla(${newHue}, ${newSat}%, ${newLight}%, ${audioEnergy * 0.3})
                `;
                
                // FILTER EFFECTS: Add brightness boost on peaks
                if (audioEnergy > 0.7) {
                    light.element.style.filter = `blur(0.3px) brightness(${1 + audioEnergy * 0.5})`;
                } else {
                    light.element.style.filter = 'blur(0.3px) brightness(1)';
                }
            });
            
            this.lightAnimationFrame = requestAnimationFrame(animateLights);
        };
        
        animateLights();
    }
    
    generateHarmonyColors() {
        if (!this.harmonySystem) {
            // Fallback: simple complementary colors
            return this.generateSimpleColors();
        }
        
        const palette = this.harmonySystem.generatePalette(
            this.state.baseHue,
            this.state.harmonyMode,
            this.state.saturation,
            this.state.lightness
        );
        
        // Ensure we have enough colors
        while (palette.length < this.state.colorCount) {
            const lastColor = palette[palette.length - 1];
            const newHue = (lastColor.hue + (360 / this.state.colorCount)) % 360;
            palette.push({
                hue: newHue,
                saturation: this.state.saturation,
                lightness: this.state.lightness,
                hsl: `hsl(${newHue}, ${this.state.saturation}%, ${this.state.lightness}%)`
            });
        }
        
        return palette.slice(0, this.state.colorCount);
    }
    
    generateSimpleColors() {
        const colors = [];
        const step = 360 / this.state.colorCount;
        
        for (let i = 0; i < this.state.colorCount; i++) {
            const hue = (this.state.baseHue + (i * step)) % 360;
            colors.push({
                hue: hue,
                saturation: this.state.saturation,
                lightness: this.state.lightness,
                hsl: `hsl(${hue}, ${this.state.saturation}%, ${this.state.lightness}%)`
            });
        }
        
        return colors;
    }
    
    setupEventListeners() {
        // Listen for color organ toggle
        this.handlers.toggle = {
            event: 'wb:color-organ-toggle',
            callback: (e) => this.handleToggle(e)
        };
        document.addEventListener(
            this.handlers.toggle.event,
            this.handlers.toggle.callback
        );
        
        // Listen for audio data
        this.handlers.audioData = {
            event: 'wb:audio-data',
            callback: (e) => this.handleAudioData(e)
        };
        document.addEventListener(
            this.handlers.audioData.event,
            this.handlers.audioData.callback
        );
        
        // Listen for color beats
        this.handlers.colorBeat = {
            event: 'wb:color-beat',
            callback: (e) => this.handleColorBeat(e)
        };
        document.addEventListener(
            this.handlers.colorBeat.event,
            this.handlers.colorBeat.callback
        );
        
        // Listen for color changes from control panel
        this.handlers.colorChange = {
            event: 'colorchange',
            callback: (e) => this.handleColorChange(e)
        };
        document.addEventListener(
            this.handlers.colorChange.event,
            this.handlers.colorChange.callback
        );
        
        // Close button
        const closeBtn = this.querySelector('#close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hide());
        }
        
        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.state.enabled) {
                this.hide();
            }
            
            // Ctrl+M to toggle mode indicator visibility
            if ((e.ctrlKey || e.metaKey) && e.key === 'm') {
                e.preventDefault();
                const modeIndicator = this.querySelector('.wb-color-organ-info');
                if (modeIndicator) {
                    const currentDisplay = window.getComputedStyle(modeIndicator).display;
                    modeIndicator.style.display = currentDisplay === 'none' ? 'flex' : 'none';
                    console.log(`Mode indicator: ${currentDisplay === 'none' ? 'SHOWN' : 'HIDDEN'}`);
                }
            }
        });
        
        console.log('✅ WB Color Organ: Event listeners attached');
    }
    
    handleToggle(e) {
        if (e.detail.enabled) {
            this.show();
        } else {
            this.hide();
        }
    }
    
    handleAudioData(e) {
        if (!this.state.enabled) return;
        
        const { bass, mids, treble } = e.detail;
        
        // Update state
        this.state.audioData = { bass, mids, treble };
        
        // Update visual indicators
        this.updateAudioIndicators(bass, mids, treble);
        
        // Animate colors based on audio
        this.animateWithAudio(bass, mids, treble);
    }
    
    handleColorBeat(e) {
        if (!this.state.enabled) return;
        
        // Pulse effect on beat
        const grid = this.querySelector('#color-organ-grid');
        if (grid) {
            grid.classList.add('pulse');
            setTimeout(() => grid.classList.remove('pulse'), 100);
        }
    }
    
    handleColorChange(e) {
        if (!e.detail) return;
        
        // Update base color
        this.state.baseHue = e.detail.hue || this.state.baseHue;
        this.state.saturation = e.detail.saturation || this.state.saturation;
        this.state.lightness = e.detail.lightness || this.state.lightness;
        
        // Regenerate colors if visible
        if (this.state.enabled) {
            this.generateColorBlocks();
        }
    }
    
    updateAudioIndicators(bass, mids, treble) {
        const bassLevel = this.querySelector('#bass-level');
        const midsLevel = this.querySelector('#mids-level');
        const trebleLevel = this.querySelector('#treble-level');
        
        if (bassLevel) bassLevel.style.height = `${bass * 100}%`;
        if (midsLevel) midsLevel.style.height = `${mids * 100}%`;
        if (trebleLevel) trebleLevel.style.height = `${treble * 100}%`;
    }
    
    animateWithAudio(bass, mids, treble) {
        if (this.state.mode === 'cracked-ice') {
            this.animateCrackedIce(bass, mids, treble);
            return;
        }
        
        const blocks = this.querySelectorAll('.wb-color-organ-block');
        
        blocks.forEach((block, index) => {
            const baseHue = parseInt(block.getAttribute('data-hue'));
            
            // Use shared AudioAnalyzer from wb-color-utils (window.AudioAnalyzer)
            if (window.AudioAnalyzer) {
                const audioData = { bass, mids, highs: treble };
                const color = window.AudioAnalyzer.mapToColor(audioData, baseHue, this.state.saturation, this.state.lightness);
                
                // Apply color
                block.style.backgroundColor = `hsl(${color.hue}, ${color.saturation}%, ${color.lightness}%)`;
                
                // Scale effect based on audio intensity
                const intensity = window.AudioAnalyzer.getEnergy(audioData);
                const scale = 1 + (intensity * 0.1);
                block.style.transform = `scale(${scale})`;
            } else {
                // Fallback to inline code if AudioAnalyzer not available
                const hueShift = bass * 30;
                const newHue = (baseHue + hueShift) % 360;
                const baseSat = this.state.saturation;
                const satBoost = mids * 30;
                const newSat = Math.min(100, baseSat + satBoost);
                const baseLight = this.state.lightness;
                const lightShift = (treble - 0.5) * 20;
                const newLight = Math.max(20, Math.min(80, baseLight + lightShift));
                block.style.backgroundColor = `hsl(${newHue}, ${newSat}%, ${newLight}%)`;
                const intensity = (bass + mids + treble) / 3;
                const scale = 1 + (intensity * 0.1);
                block.style.transform = `scale(${scale})`;
            }
        });
    }
    
    animateCrackedIce(bass, mids, treble) {
        const shards = this.querySelectorAll('.wb-color-organ-shard');
        
        shards.forEach((shard, index) => {
            const baseHue = parseInt(shard.getAttribute('data-hue'));
            const baseRotation = parseFloat(shard.getAttribute('data-rotation'));
            
            // Use shared AudioAnalyzer from wb-color-utils (window.AudioAnalyzer)
            if (window.AudioAnalyzer) {
                const audioData = { bass, mids, highs: treble };
                const color = window.AudioAnalyzer.mapToColor(audioData, baseHue, this.state.saturation, this.state.lightness);
                
                // Treble creates extra shimmer for cracked ice
                const extraLightShift = (treble - 0.5) * 5;
                const newLight = Math.max(30, Math.min(85, color.lightness + extraLightShift));
            
                // Apply color with slight transparency for layered effect
                const alpha = 0.85 + (treble * 0.15);
                shard.style.backgroundColor = `hsla(${color.hue}, ${color.saturation}%, ${newLight}%, ${alpha})`;
                
                // Subtle rotation on bass hits
                const rotationShift = (bass - 0.5) * 3;
                const newRotation = baseRotation + rotationShift;
                
                // Scale varies per shard based on audio
                const shardPhase = (index / shards.length) * Math.PI * 2;
                const phaseOffset = Math.sin(shardPhase + (Date.now() * 0.001));
                const intensity = window.AudioAnalyzer.getEnergy(audioData);
                const scale = 1 + (intensity * 0.08) + (phaseOffset * 0.02);
            } else {
                // Fallback
                const hueShift = bass * 30;
                const newHue = (baseHue + hueShift) % 360;
                const baseSat = this.state.saturation;
                const satBoost = mids * 30;
                const newSat = Math.min(100, baseSat + satBoost);
                const baseLight = this.state.lightness;
                const lightShift = (treble - 0.5) * 25;
                const newLight = Math.max(30, Math.min(85, baseLight + lightShift));
                const alpha = 0.85 + (treble * 0.15);
                shard.style.backgroundColor = `hsla(${newHue}, ${newSat}%, ${newLight}%, ${alpha})`;
                const rotationShift = (bass - 0.5) * 3;
                const newRotation = baseRotation + rotationShift;
                const shardPhase = (index / shards.length) * Math.PI * 2;
                const phaseOffset = Math.sin(shardPhase + (Date.now() * 0.001));
                const intensity = (bass + mids + treble) / 3;
                const scale = 1 + (intensity * 0.08) + (phaseOffset * 0.02);
            }
            
            shard.style.transform = `rotate(${newRotation}deg) scale(${scale})`;
            
            // Update glass overlay opacity for shimmer
            const glassOverlay = shard.querySelector('.shard-glass-overlay');
            if (glassOverlay) {
                glassOverlay.style.opacity = 0.3 + (treble * 0.3);
            }
            
            // Highlight flashes on beats
            const highlight = shard.querySelector('.shard-highlight');
            if (highlight) {
                const highlightIntensity = Math.max(bass, mids, treble);
                highlight.style.opacity = highlightIntensity * 0.6;
            }
        });
    }
    
    show() {
        this.state.enabled = true;
        this.classList.add('active');
        
        // Generate fresh colors
        this.generateColorBlocks();
        
        // Start animation loop
        this.startAnimation();
        
        console.log('🎵 Color Organ: Activated');
        
        // Dispatch event
        document.dispatchEvent(new CustomEvent('wb:color-organ-shown', {
            detail: { mode: this.state.mode },
            bubbles: true
        }));
    }
    
    hide() {
        this.state.enabled = false;
        this.classList.remove('active');
        
        // Stop animations
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
        
        if (this.lightAnimationFrame) {
            cancelAnimationFrame(this.lightAnimationFrame);
            this.lightAnimationFrame = null;
        }
        
        if (this.laserAnimationFrame) {
            cancelAnimationFrame(this.laserAnimationFrame);
            this.laserAnimationFrame = null;
        }
        
        console.log('🎵 Color Organ: Deactivated');
        
        // Dispatch event
        document.dispatchEvent(new CustomEvent('wb:color-organ-hidden', {
            bubbles: true
        }));
        
        // Tell control panel to disable
        document.dispatchEvent(new CustomEvent('wb:color-organ-toggle', {
            detail: { enabled: false, source: 'color-organ' },
            bubbles: true
        }));
    }
    
    startAnimation() {
        const animate = () => {
            if (!this.state.enabled) return;
            
            // Smooth animation loop
            this.animationFrame = requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    applyInitialSettings() {
        // Load saved settings
        const savedMode = localStorage.getItem('wb-color-organ-mode') || 'blocks';
        const savedHarmony = localStorage.getItem('wb-harmony-mode') || 'complementary';
        
        this.state.mode = savedMode;
        this.state.harmonyMode = savedHarmony;
        
        console.log(`🎨 Color Organ: Mode=${savedMode}, Harmony=${savedHarmony}`);
    }
    
    // Public API
    setMode(mode) {
        const validModes = ['blocks', 'gradient', 'pulse', 'wave', 'cracked-ice', 'laser'];
        if (!validModes.includes(mode)) {
            console.warn(`Invalid mode: ${mode}`);
            return;
        }
        
        this.state.mode = mode;
        localStorage.setItem('wb-color-organ-mode', mode);
        
        // Update display
        const modeName = mode === 'cracked-ice' ? 'Cracked Ice' : 
                        mode === 'laser' ? 'LASER' :
                        mode.charAt(0).toUpperCase() + mode.slice(1);
        
        const modeIndicator = this.querySelector('#mode-indicator');
        if (modeIndicator) {
            modeIndicator.textContent = `${modeName} Mode`;
        }
        
        // Apply mode to grid
        const grid = this.querySelector('#color-organ-grid');
        if (grid) {
            grid.className = 'wb-color-organ-grid';
            if (mode !== 'blocks') {
                grid.classList.add(`${mode}-mode`);
            }
        }
        
        // Regenerate for special modes
        if (mode === 'cracked-ice' && this.state.enabled) {
            this.generateCrackedIceShards();
        } else if (mode === 'laser' && this.state.enabled) {
            this.generateLaserBeams();
        } else if (this.state.enabled) {
            this.generateColorBlocks();
        }
        
        console.log(`🎨 Color Organ: Mode changed to ${mode}`);
    }
    
    setHarmonyMode(mode) {
        this.state.harmonyMode = mode;
        localStorage.setItem('wb-harmony-mode', mode);
        
        if (this.state.enabled) {
            this.generateColorBlocks();
        }
        
        console.log(`🎨 Color Organ: Harmony mode changed to ${mode}`);
    }
    
    setColorCount(count) {
        this.state.colorCount = Math.max(2, Math.min(16, count));
        
        if (this.state.enabled) {
            this.generateColorBlocks();
        }
    }
    
    getState() {
        return { ...this.state };
    }
}

// Register component
if (!customElements.get('wb-color-organ')) {
    customElements.define('wb-color-organ', WBColorOrgan);
    console.log('✅ wb-color-organ registered - Now using shared wb-color-utils when available!');
}

// Compositional Namespace
if (!window.WB) window.WB = { components: {}, utils: {} };
window.WB.components.WBColorOrgan = WBColorOrgan;

// Expose globally (backward compatibility)
window.WBColorOrgan = WBColorOrgan;

// ES6 Module Exports
export { WBColorOrgan };
export default WBColorOrgan;

console.log('🎵 WB Color Organ component loaded - Will use AudioAnalyzer from wb-color-utils if available');
