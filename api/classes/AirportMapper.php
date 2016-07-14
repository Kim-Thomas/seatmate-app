<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of AirportMapper
 *
 * @author jean-baptistedominguez
 */
class AirportMapper extends Mapper {
    
    public function getAirports() {
        $sql = "SELECT *
            FROM airports";
        $stmt = $this->db->prepare($sql);
        $stmt->execute();
        $results = [];
        while($row = $stmt->fetch()) {
            $results[] = new Airport($row);
        }
        return $results;
    }
    
    public function searchAirports($word) {
        $sql = "SELECT *
            FROM airports WHERE name LIKE \"%" . $word . "%\" 
            OR city LIKE \"%" . $word . "%\" 
            OR code_airport_IATA LIKE \"%" . $word . "%\"";
        $stmt = $this->db->prepare($sql);
        $stmt->execute();
        $results = [];
        while($row = $stmt->fetch()) {
            $results[] = new Airport($row);
        }
        return $results;
    }
}
