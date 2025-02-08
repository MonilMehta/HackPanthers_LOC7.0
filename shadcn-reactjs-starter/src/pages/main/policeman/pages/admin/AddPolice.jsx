"use client"

import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

const AddPolice = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    badgeNumber: '',
    email: '',
    phone: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/add-officer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        toast({
          title: "Success",
          description: "Officer added successfully",
          action: (
            <ToastAction altText="Dismiss">Dismiss</ToastAction>
          ),
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to add officer",
          action: (
            <ToastAction altText="Try again">Try again</ToastAction>
          ),
        });
      }
    } catch (error) {
      console.error('Error adding officer:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while adding the officer",
        action: (
          <ToastAction altText="Try again">Try again</ToastAction>
        ),
      });
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Add New Police Officer</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter full name"
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="badgeNumber">Badge Number</Label>
              <Input
                id="badgeNumber"
                name="badgeNumber"
                placeholder="Enter badge number"
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="Enter email address"
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                name="phone"
                placeholder="Enter phone number"
                onChange={handleChange}
                required
              />
            </div>

            <Button type="submit" className="w-full">
              Add Officer
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddPolice;