<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of Mapper
 *
 * @author jean-baptistedominguez
 */
abstract class Mapper {
    protected $db;
    
    public function __construct($db) {
        $this->db = $db;
        $this->db->exec("SET CHARACTER SET utf8");
    }
}