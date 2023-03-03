import * as THREE from 'three';

import Experience from '../Experience';

export default class Controlls{
    constructor(){
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.createBottomPanel();
        this.createRefreshButton() ; 
    }

    createBottomPanel(){
        this.bottomPanel = document.createElement('div');
        this.bottomPanel.style.width = '100%';
        this.bottomPanel.style.height = '5vh';
        this.bottomPanel.style.position = 'relative';
        this.bottomPanel.style.zIndex = 2 ; 
        this.bottomPanel.style.backgroundColor = 'red';
        this.bottomPanel.style.top = '10vh'
        document.body.appendChild(this.bottomPanel);
    }

    createRefreshButton(){
    }

    update(){

    }
}