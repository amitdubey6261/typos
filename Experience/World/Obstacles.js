import * as THREE from 'three' ; 
import * as CANNON from 'cannon-es' ;

import Experience from '../Experience';
import Words from './Words';

export default class Obstacles{
    constructor(){
        this.experince = new Experience();
        this.scene = this.experince.scene ;
        this.resources = this.experince.resources;
        this.flag = false ;
        this.idx = 0 ;  
        setTimeout(()=>{
            this.world = this.experince.world.cworld ; 
            this.createObs();
            this.flag = true ; 
        } , 1000)
    }

    createObs(){
        this.obstacle = new CANNON.Body({
            shape : new CANNON.Box(new CANNON.Vec3( 0.1 , 0.1 , 0.1 )),
            position : new CANNON.Vec3( 0 , 0 , Math.floor(Math.random() * (-5 - -3) ) + -3 )
        })
        this.world.addBody(this.obstacle);
        this.idx++ ; 
        if(this.idx >= Words.length ){
            this.idx = 0 ; 
        }
    }
    
    update(){
        if(this.flag){
            this.obstacle.position.z += 0.05 ;
            if(this.obstacle.position.z > 5){
                this.world.removeBody(this.obstacle)
                this.createObs();
            }
        }
    }

}