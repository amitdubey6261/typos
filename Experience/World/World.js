import * as THREE from 'three'
import * as CANNON from 'cannon-es';
import CannonDebugger from "cannon-es-debugger";

import Experience from '../Experience';
import Car from './Car';
import Enviroment from './Enviroment';

export default class World{
    constructor(){
        this.timeStep = 1/60 ; 
        this.experience = new Experience();
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.canvas= this.experience.canvas;
        this.enviroment = new Enviroment();
        this.createCannonWorld();
        this.car = new Car();
    }

    createCannonWorld(){
        this.cworld = new CANNON.World();
        this.cworld.gravity.set( 0 , -10 , 0 );
        this.CannonDebugger = new CannonDebugger( this.scene , this.cworld , {
            color : 0xff0000,
            scale : 1.0
        });
    }

    update(){
        this.cworld.step(this.timeStep);
        this.CannonDebugger.update();
        this.car.update();
    }
}