import * as THREE from 'three';

import Experience from '../Experience';

export default class Enviroment{
    constructor(){
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.setLight();
        this.createPanel();
    }

    createPanel(){
        this.panel = document.createElement('div'); 
        this.panel.style.backgroundColor = 'red' ; 
        this.panel.style.width = '10cm' ; 
        this.panel.style.height = '10cm' ;
        this.panel.style.position = 'relative' ; 
        this.panel.style.zIndex = 2 ;
        this.panel.style.visibility = 'hidden';
        document.body.appendChild(this.panel);
    }

    setLight(){
        this.abmLight = new THREE.AmbientLight(  0xf3e7d3 , 100 );
        this.scene.add(this.abmLight);
    }

    update(){

    }
}