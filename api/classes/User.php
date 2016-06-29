<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of User
 *
 * @author jean-baptistedominguez
 */
class User implements JsonSerializable {
    
    protected $id;
    protected $mail;
    protected $password;
    protected $facebookId;
    protected $pseudo;
    protected $token;
    protected $tokenDate;


    public function __construct(array $data) {
        if (isset($data['id'])) {
            $this->id = $data['id'];
        }
        $this->mail = $data['mail'];
        $this->password = $data['password'];
        $this->facebookId = $data['facebook_id'];
        $this->pseudo = $data['pseudo'];
        $this->token = $data['token'];
        $this->tokenDate = $data['token_date'];
    }
    
    public function getId() {
        return $this->id;
    }
    
    public function setId($id) {
        $this->id = $id;
    }
    
    public function getMail() {
        return $this->mail;
    }
    
    public function getPassword() {
        return $this->password;
    }
    
    public function getFacebookId() {
        return $this->facebookId;
    }
    
    public function getPseudo() {
        return $this->pseudo;
    }
    
    public function getToken() {
        return $this->token;
    }
    
    public function setToken($token) {
        $this->token = $token;
    }
    
    public function getTokenDate() {
        return $this->tokenDate;
    }
    
    public function setTokenDate($tokenDate) {
        $this->tokenDate = $tokenDate;
    }

    public function jsonSerialize() {
        $json = array(
            "id" => $this->id,
            "mail" => $this->mail,
            "facebook_id" => $this->facebookId,
            "pseudo" => $this->pseudo
        );
        return $json;
    }

}
