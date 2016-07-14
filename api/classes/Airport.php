<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of Airport
 *
 * @author jean-baptistedominguez
 */
class Airport implements JsonSerializable {
    
    protected $id;
    protected $name;
    protected $city;
    protected $country;
    protected $codeAirtportIATA;
    protected $codeAirtportCAO;
    protected $latitude;
    protected $longitude;
    protected $elevation;
    protected $UTC;
    protected $DST1;
    protected $DST2;


    public function __construct(array $data) {
        if (isset($data['id'])) {
            $this->id = $data['id'];
        }
        $this->name = $data['name'];
        $this->city = $data['city'];
        $this->country = $data['country'];
        $this->codeAirtportIATA = $data['code_airport_IATA'];
        $this->codeAirtportCAO = $data['code_airport_ICAO'];
        $this->latitude = $data['latitude'];
        $this->longitude = $data['longitude'];
        $this->elevation = $data['elevation'];
        $this->UTC = $data['UTC'];
        $this->DST1 = $data['DST1'];
        $this->DST2 = $data['DST2'];
    }
    
    public function getId() {
        return $this->id;
    }
    
    public function setId($id) {
        $this->id = $id;
    }
    
    public function getCity() {
        return $this->city;
    }
    
    public function getCountry() {
        return $this->country;
    }

    public function jsonSerialize() {
        $json = array(
            "id" => $this->id,
            "name" => $this->name,
            "city" => $this->city,
            "country" => $this->country,
            "code_airtport_IATA" => $this->codeAirtportIATA,
            "code_airtport_ICAO" => $this->codeAirtportICAO,
            "latitude" => $this->latitude,
            "longitude" => $this->longitude,
            "elevation" => $this->elevation,
            "UTC" => $this->UTC,
            "DST1" => $this->DST1,
            "DST2" => $this->DST2
        );
        return $json;
    }

}
