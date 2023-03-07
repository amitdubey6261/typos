import * as THREE from 'three'
import * as CANNON from 'cannon-es';
import CannonDebugger from "cannon-es-debugger";

import Experience from '../Experience';
import Enviroment from './Enviroment';
import Words from './Words';

export default class World {
    constructor() {
        this.timeStep = 1 / 60;
        this.experience = new Experience();
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.canvas = this.experience.canvas;
        this.enviroment = new Enviroment();
        this.stringMatcher = "";
        this.idx = 0;
        this.collisionCount = 0;
        this.createCannonWorld();
        this.setJump();
    }


    createCannonWorld() {
        this.CannonWorld = new CANNON.World({
            gravity: new CANNON.Vec3(0, -10, 0),
        })

        this.CannonDebugger = new CannonDebugger(this.scene, this.CannonWorld, {
            color: 0xff0000,
            scale: 1.0
        })
        this.createGround();
        this.createCharacter();
        this.createBuildings();
        this.createMessageDialer();
        this.createObstacles();
        this.setEventListner();
    }

    createMessageDialer() {
        this.dialer = document.createElement('div');
        this.dialer.style.position = 'relative';
        this.dialer.style.zIndex = 2;
        this.dialer.style.width = `${window.screen.availWidth}px`;
        this.dialer.style.height = `${window.screen.availHeight}px`;
        // this.dialer.style.backgroundColor = 'red';
        document.body.appendChild(this.dialer);
        this.MessgBox = document.createElement('center');
        this.MessgBox.style.color = 'white';
        this.dialer.appendChild(this.MessgBox);
    }

    createCharacter() {
        this.characterBody = new CANNON.Body({
            shape: new CANNON.Box(new CANNON.Vec3(0.1, 0.2, 0.1)),
            position: new CANNON.Vec3(0, 1, 0),
            mass: 100
        })

        this.characterBody.id = 3;

        this.CannonWorld.addBody(this.characterBody)
    }

    setEventListner() {
        this.characterBody.addEventListener('collide', (e) => {
            if (e.body.id == 1) {
                this.collisionCount += 1;
            }
        })
    }

    createGround() {
        this.groundBody = new CANNON.Body({
            shape: new CANNON.Plane(10, 10),
            position: (0, 0, 0),
            mass: 0,
        })
        this.groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
        this.groundBody.id = 2;
        this.CannonWorld.addBody(this.groundBody);
    }


    createObstacles() {
        if (this.MessgBox) {
            this.MessgBox.innerHTML = `<h1>${Words[this.idx]}</h1>`;
        }
        this.Obstaclebody = new CANNON.Body({
            shape: new CANNON.Box(new CANNON.Vec3(0.1, 0.1, 0.1)),
            position: new CANNON.Vec3(0, 1, -5),
            mass: 1,
        })

        this.Obstaclebody.id = 1;

        this.CannonWorld.addBody(this.Obstaclebody);
    }

    createBuildings() {
        this.BuildingArrayLeft = [];
        this.BuildingArrayRight = [];
        for (let i = 0; i < 10; i++) {
            this.BuildingArrayLeft.push(new CANNON.Body({
                shape: new CANNON.Box(new CANNON.Vec3(0.3, 0.3, 0.3)),
                position: new CANNON.Vec3(-2, 0.2, -5 + i),
                mass: 1,
            }));
            this.BuildingArrayRight.push(new CANNON.Body({
                shape: new CANNON.Box(new CANNON.Vec3(0.3, 0.3, 0.3)),
                position: new CANNON.Vec3(2, 0.2, -5 + i),
                mass: 1,
            }));
        }

        this.BuildingArrayLeft.map((e) => {
            this.CannonWorld.addBody(e)
        })

        this.BuildingArrayRight.map((e) => {
            this.CannonWorld.addBody(e)
        })
    }

    setJump() {
        window.addEventListener('keydown', (e) => {
            if (e.defaultPrevented) {
                return;
            }
            this.stringMatcher += e.key;
            e.preventDefault();
        })
    }

    jump() {
        this.characterBody.velocity = new CANNON.Vec3(0, 5, 0);
        this.stringMatcher = "";
    }

    update() {
        this.CannonWorld.step(this.timeStep)
        this.CannonDebugger.update();
        if (this.Obstaclebody.position.z > 5) {
            this.CannonWorld.removeBody(this.Obstaclebody);
            this.idx += 1;
            if (this.idx === Words.length) {
                this.idx = 0;
            }
            this.createObstacles();
        }
        this.listenString();
        this.Obstaclebody.position.z += 0.01;

        //UPDATE BUILDING
        if (this.BuildingArrayLeft) {
            this.BuildingArrayLeft.map((e) => {
                e.position.z += 0.02;
                if (e.position.z > 5) {
                    e.position.z = -5;
                }
            })
        }

        if (this.BuildingArrayRight) {
            this.BuildingArrayRight.map((e) => {
                e.position.z += 0.02;
                if (e.position.z > 5) {
                    e.position.z = -5;
                }
            })
        }

        //

        if (this.collisionCount > 0) {
            this.collisionCount = 0;
            this.setDialer();
        }
    }

    listenString() {
        if (this.stringMatcher.length == Words[this.idx].length && (this.stringMatcher === Words[this.idx])) {
            this.jump();
        }
    }

    setDialer() {
        this.MessgBox.innerHTML = `<h1>${"GAME OVER"}</h1>`;
        this.dialer.style.backgroundColor = 'red';
        this.dialer.style.opacity = 0.4 ; 
        this.playButton = document.createElement('center');
        this.playButton.innerText = 'PLAY AGAIN';
        this.playButton.addEventListener('click' , ()=>{
            window.location.reload();
        })
        this.dialer.appendChild(this.playButton);
        process.exit();
    }
}