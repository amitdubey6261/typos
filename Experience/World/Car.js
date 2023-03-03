import * as THREE from 'three';
import * as CANNON from 'cannon-es';

import Experience from '../Experience'
import Obstacles from './Obstacles';

export default class Car{
    constructor(){
        this.experience = new Experience(); 
        this.scene = this.experience.scene ;
        this.resources = this.experience.resources ;
        this.car = this.resources.items.car.scene ;
        this.flag = 0 ; 
        setTimeout(()=>{
            this.world = this.experience.world.cworld ;
            this.setup();
            this.flag = 1 ; 
            this.obstacles = new Obstacles();
        } , 1000)
    }

    setup(){
        this.plane = new CANNON.Body({
            shape : new CANNON.Plane() , 
            mass : 0 
        })

        this.plane.quaternion.setFromEuler(-Math.PI/2 , 0 , 0)
        this.world.addBody(this.plane)

        this.box = new CANNON.Body({
            shape:new CANNON.Box(new CANNON.Vec3( 0.1,0.2,0.1 )),
            mass : 1 ,
            position : new CANNON.Vec3( 0 , 10 , 0 ) , 
            id : 1
        })    
        this.world.addBody(this.box);
        this.scene.add(this.car)

        this.setInteractions();
    }

    setInteractions(){
        window.addEventListener('click' , ()=>{
            this.box.velocity = new CANNON.Vec3( 0 , 5 , 0) ;
        })
    }

    update(){
        if(this.flag){
            this.car.position.copy(this.box.position);
            this.car.quaternion.copy(this.box.quaternion);
            this.obstacles.update();
        }
    }
}