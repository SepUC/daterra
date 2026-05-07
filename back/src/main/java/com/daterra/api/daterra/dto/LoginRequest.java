package com.daterra.api.daterra.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String password;
}
