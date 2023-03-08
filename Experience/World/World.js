import * as THREE from 'three'
import * as CANNON from 'cannon-es';
import { Howl } from 'howler';
import CannonDebugger from "cannon-es-debugger";

import Experience from '../Experience';
import Enviroment from './Enviroment';
import Words from './Words';
import Sketch from './Sketch';

import p5 from 'p5';


export default class World {
    constructor() {
        this.timeStep = 1 / 60;
        this.experience = new Experience();
        this.createSounds();
        this.sizes = this.experience.sizes;
        this.resources = this.experience.resources ; 
        this.scene = this.experience.scene;
        this.canvas = this.experience.canvas;
        this.enviroment = new Enviroment();
        this.p5 = new p5(Sketch());
        this.stringMatcher = "";
        this.idx = 0;
        this.score = 0 ; 
        this.collisionCount = 0;
        this.createCannonWorld();
        this.setJump();
    }

    createSounds(){
        this.goingy = new Howl({
            src : ['./going.mp3'] ,
            loop : true ,
        })
        this.jumpy = new Howl({
            src :['./jump.mp3']
        })
        this.overy = new Howl({
            src :['./over.mp3']
        })
        this.starty = new Howl({
            src :['./start.mp3']
        })
    }


    createCannonWorld() {
        this.CannonWorld = new CANNON.World({
            gravity: new CANNON.Vec3(0, -10, 0),
        })

        // this.CannonDebugger = new CannonDebugger(this.scene, this.CannonWorld, {
        //     color: 0xff0000,
        //     scale: 1.0
        // })

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
        this.dialer.style.height = `${window.screen.availHeight/3}px`;
        document.body.appendChild(this.dialer);
        this.MessgBox = document.createElement('center');
        this.MessgBox.style.color = 'red';
        this.MessgBox.style.fontSize = '50px';
        this.scoreBox = document.createElement('div');
        this.scoreBox.style.color = 'white';
        this.scoreBox.innerHTML = `${this.score}`;
        this.scoreBox.style.fontSize = '50px';
        this.dialer.appendChild(this.scoreBox);
        this.dialer.appendChild(this.MessgBox);
    }

    createCharacter() {
        this.character = this.resources.items.character.scene.clone();

        this.characterBody = new CANNON.Body({
            shape: new CANNON.Box(new CANNON.Vec3(0.1, 0.2, 0.1)),
            position: new CANNON.Vec3(0, 1, 0),
            mass: 100
        })

        this.characterBody.id = 3;

        this.scene.add(this.character);
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
        this.starty.play();
        setTimeout(()=>{this.goingy.play()} , 4000);
        this.groundBody = new CANNON.Body({
            shape: new CANNON.Plane(10, 10),
            position: (0, 0, 0),
            mass: 0,
        })

        this.ground = this.resources.items.ground.scene.clone();

        this.scene.add(this.ground);

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

        this.obstacle = this.resources.items.obstacle.scene.clone();

        this.scene.add(this.obstacle);
    }

    createBuildings() {

        this.BuildingArrayLeft = [];
        this.BuildingArrayLeftB = [];
        this.BuildingArrayRight = [];
        this.BuildingArrayRightB = [];
        
        
        for (let i = 0; i < 10; i++) {

            this.BuildingArrayLeft.push(new CANNON.Body({
                shape: new CANNON.Box(new CANNON.Vec3(0.3, 0.7, 0.3)),
                position: new CANNON.Vec3(-2, 0.7, -5 + i),
                mass: 1,
            }));

            this.BuildingArrayLeftB[i] = this.resources.items.building.scene.children[0].clone() ; 
            
            this.BuildingArrayRight.push(new CANNON.Body({
                shape: new CANNON.Box(new CANNON.Vec3(0.3, 0.7, 0.3)),
                position: new CANNON.Vec3(2, 0.7, -5 + i),
                mass: 1,
            }));

            this.BuildingArrayRightB[i] = this.resources.items.building.scene.children[0].clone() ; 

        }

        this.BuildingArrayLeft.map((e) => {
            this.CannonWorld.addBody(e)
        })

        this.BuildingArrayLeftB.map((e)=>{
            this.scene.add(e);
        })

        this.BuildingArrayRightB.map((e)=>{
            this.scene.add(e);
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
        this.jumpy.play();
        this.characterBody.velocity = new CANNON.Vec3(0, 5, 0);
        this.stringMatcher = "";
    }

    update() {
        this.CannonWorld.step(this.timeStep)
        // this.CannonDebugger.update();
        if (this.Obstaclebody.position.z > 5) {
            this.CannonWorld.removeBody(this.Obstaclebody);
            this.idx += 1;
            if (this.idx === Words.length) {
                this.idx = 0;
            }
            this.createObstacles();
        }
        this.listenString();
        this.Obstaclebody.position.z += 0.02;

        if (this.BuildingArrayLeft) {
            this.BuildingArrayLeft.map((e) => {
                e.position.z += 0.02;
                if (e.position.z > 5) {
                    this.score +=1 ; 
                    this.scoreBox.innerHTML = `${this.score}`;
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

        if (this.collisionCount > 0) {
            this.collisionCount = 0;
            this.setDialer();
        }


        for(let i = 0 ; i<10 ; i++ ){
            this.BuildingArrayLeftB[i].position.copy(this.BuildingArrayLeft[i].position);
            this.BuildingArrayLeftB[i].quaternion.copy(this.BuildingArrayLeft[i].quaternion);
        }

        for(let i = 0 ; i<10 ; i++ ){
            this.BuildingArrayRightB[i].position.copy(this.BuildingArrayRight[i].position);
            this.BuildingArrayRightB[i].quaternion.copy(this.BuildingArrayRight[i].quaternion);
        }

        this.obstacle.position.copy(this.Obstaclebody.position)
        this.obstacle.quaternion.copy(this.Obstaclebody.quaternion)

        this.ground.position.copy(this.groundBody.position)

        this.character.position.copy(this.characterBody.position);
        this.character.quaternion.copy(this.characterBody.quaternion);
    }

    listenString() {
        if (this.stringMatcher.length == Words[this.idx].length && (this.stringMatcher === Words[this.idx])) {
            this.jump();
        }
    }

    setDialer() {
        this.overy.play();
        this.goingy.stop();
        this.MessgBox.innerHTML = `<h1>${"GAME OVER"}</h1>`;
        this.dialer.style.backgroundColor = 'red';
        this.dialer.style.opacity = 0.4 ; 
        this.playButton = document.createElement('button');
        this.playButton.innerText = 'PLAY AGAIN';
        this.playButton.addEventListener('click' , ()=>{
            window.location.reload();
        })
        this.dialer.appendChild(this.playButton);
        process.exit();
    }
}