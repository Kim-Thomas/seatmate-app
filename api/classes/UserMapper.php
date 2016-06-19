<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of UserMapper
 *
 * @author jean-baptistedominguez
 */
class UserMapper extends Mapper {
    
    public function getUsers() {
        $sql = "SELECT u.id, u.mail, u.password, u.facebook_id, u.pseudo
            FROM users u";
        $stmt = $this->db->query($sql);
        $results = [];
        while($row = $stmt->fetch()) {
            $results[] = new User($row);
        }
        return $results;
    }
    
    public function findUserById($id) {
        $sql = "SELECT u.id, u.mail, u.password, u.facebook_id, u.pseudo
            FROM users u WHERE u.id=:id";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            "id" => $id
        ]);
        $result = null;
        if($row = $stmt->fetch()) {
            $result = new User($row);
        }
        else {
            throw new Exception("could not find record");
        }
        return $result;
    }
    
    public function findUser(User $user) {
        $sql = "SELECT u.id, u.mail, u.password, u.facebook_id, u.pseudo
            FROM users u WHERE u.mail=:mail AND u.password=:password";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            "mail" => $user->getMail(),
            "password" => $user->getPassword()
        ]);
        $result = null;
        if($row = $stmt->fetch()) {
            $result = new User($row);
        }
        else {
            throw new Exception("could not find record");
        }
        return $result;
    }
    
    public function findUserByToken($token) {
        $sql = "SELECT u.id, u.mail, u.password, u.facebook_id, u.pseudo
            FROM users u WHERE u.token=:token";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            "token" => $token
        ]);
        $result = null;
        if($row = $stmt->fetch()) {
            $result = new User($row);
        }
        return $result;
    }
    
    public function createUser(User $user) {
        $sql = "INSERT INTO users
            (mail, password, facebook_id, pseudo) values
            (:mail, :password, :facebook_id, :pseudo)";
        $stmt = $this->db->prepare($sql);
        $result = $stmt->execute([
            "mail" => $user->getMail(),
            "password" => $user->getPassword(),
            "facebook_id" => $user->getFacebookId(),
            "pseudo" => $user->getPseudo()
        ]);
        if(!$result) {
            throw new Exception("could not save record");
        }
    }
    
    public function save(User $user) {
        $sql = "UPDATE users SET
            mail=:mail, password=:password, facebook_id=:facebook_id, 
            pseudo=:pseudo, token=:token, token_date=:token_date
            WHERE id=:id";
        $stmt = $this->db->prepare($sql);
        $result = $stmt->execute([
            "mail" => $user->getMail(),
            "password" => $user->getPassword(),
            "facebook_id" => $user->getFacebookId(),
            "pseudo" => $user->getPseudo(),
            "token" => $user->getToken(),
            "token_date" => $user->getTokenDate(),
            "id" => $user->getId()
        ]);
        if(!$result) {
            throw new Exception("could not save record");
        }
    }
}
