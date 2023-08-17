package com.PrintLab.exception;

public class PressMachineIsNotSelected extends RuntimeException{
    public PressMachineIsNotSelected(String message)
    {
        super(message);
    }
}
