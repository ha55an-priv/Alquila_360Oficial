"use client";

import React, { useState } from "react";
import styles from "./page.module.css";
import Navbar from "@/components/PropNavbar";
import { createProperty } from "@/app/services/property.service";
import { NewProperty } from "@/app/interfaces/property.interface";

const NewPropertyPage = () => {
  const [formData, setFormData] = useState<NewProperty>({
    location: "",
    type: "",
    description: "",
    price: 0,
    ownerCi: "",
    contact: "",
    whatsapp: "",
    photos: [],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) : value,
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const photoArray = Array.from(files).map(file => URL.createObjectURL(file));
      setFormData(prev => ({
        ...prev,
        photos: photoArray,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createProperty(formData);
    alert("Propiedad publicada exitosamente");
    setFormData({
      location: "",
      type: "",
      description: "",
      price: 0,
      ownerCi: "",
      contact: "",
      whatsapp: "",
      photos: [],
    });
  };

  return (
    <>
      <Navbar />
      <main className={styles.formContainer}>
        <h2 className={styles.title}>Publicar Nueva Propiedad</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>Añadir Fotos</label>
          <input type="file" multiple accept="image/*" onChange={handlePhotoUpload} className={styles.inputFile} />

          <label className={styles.label}>Ubicación</label>
          <input type="text" name="location" value={formData.location} onChange={handleChange} className={styles.input} required />

          <label className={styles.label}>Tipo de Propiedad</label>
          <input type="text" name="type" value={formData.type} onChange={handleChange} className={styles.input} required />

          <label className={styles.label}>Descripción</label>
          <textarea name="description" value={formData.description} onChange={handleChange} className={styles.textarea} required />

          <label className={styles.label}>Precio (Bs)</label>
          <input type="number" name="price" value={formData.price} onChange={handleChange} className={styles.input} required />

          <label className={styles.label}>CI del Propietario</label>
          <input type="text" name="ownerCi" value={formData.ownerCi} onChange={handleChange} className={styles.input} required />

          <label className={styles.label}>Contacto</label>
          <input type="text" name="contact" value={formData.contact} onChange={handleChange} className={styles.input} required />

          <label className={styles.label}>WhatsApp</label>
          <input type="text" name="whatsapp" value={formData.whatsapp} onChange={handleChange} className={styles.input} required />

          <button type="submit" className={styles.submitButton}>PUBLICAR</button>
        </form>
      </main>
    </>
  );
};

export default NewPropertyPage;