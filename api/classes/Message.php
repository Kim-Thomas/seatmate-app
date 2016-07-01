<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of Message
 *
 * @author jean-baptistedominguez
 */
class Message implements JsonSerializable {
    
    protected $id;
    protected $content;
    protected $dateCreated;
    protected $userIdS;
    protected $userIdD;


    public function __construct(array $data) {
        if (isset($data['id'])) {
            $this->id = $data['id'];
        }
        $this->content = htmlspecialchars($data['content']);
        $this->dateCreated = $data['date_created'];
        $this->userIdS = $data['user_id_s'];
        $this->userIdD = $data['user_id_d'];
    }
    
    public function getId() {
        return $this->id;
    }
    
    public function getContent() {
        return $this->content;
    }
    
    public function getDateCreated() {
        return $this->dateCreated;
    }
    
    public function getUserIdS() {
        return $this->userIdS;
    }
    
    public function getUserIdD() {
        return $this->userIdD;
    }

    public function jsonSerialize() {
        $json = array(
            "id" => $this->id,
            "content" => $this->content,
            "date_created" => $this->dateCreated,
            "user_id_s" => $this->userIdS,
            "user_id_d" => $this->userIdD
        );
        return $json;
    }

}
