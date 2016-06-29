<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of MessageMapper
 *
 * @author jean-baptistedominguez
 */
class MessageMapper extends Mapper {
    
    public function findMessagesByUserId($userId1, $userId2) {
        $sql = "SELECT m.id, m.content, m.date_created, m.user_id_s, m.user_id_d
            FROM messages m WHERE (m.user_id_s=:id_1 AND m.user_id_d=:id_2) 
            OR (m.user_id_s=:id_2 AND m.user_id_d=:id_1)";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            "id_1" => $userId1,
            "id_2" => $userId2
        ]);
        $results = [];
        while($row = $stmt->fetch()) {
            $results[] = new Message($row);
        }
        return $results;
    }
}
