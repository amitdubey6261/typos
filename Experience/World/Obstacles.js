import * as THREE from 'three' ; 
import * as CANNON from 'cannon-es' ;

import Experience from '../Experience';

export default class Obstacles{
    constructor(){
        this.experince = new Experience();
        this.scene = this.experince.scene ;
        this.resources = this.experince.resources;
        this.flag = false ; 
        setTimeout(()=>{
            this.world = this.experince.world.cworld ; 
            this.createObs();
            this.flag = true ; 
        } , 1000)

    }

    createObs(){
        this.obstacle = new CANNON.Body({
            shape : new CANNON.Box(new CANNON.Vec3( 0.1 , 0.1 , 0.1 )),
            position : new CANNON.Vec3( 0 , 0 , -3)
        })
        this.world.addBody(this.obstacle)
    }
    
    update(){
        if(this.flag){
            // console.log("ji")
            
        }
    }

}