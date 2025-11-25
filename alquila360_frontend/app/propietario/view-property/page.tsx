"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./page.module.css";
import Navbar from "@/components/PropNavbar";
import { getPropertyById } from "@/app/services/property.service";
import { Property } from "@/app/interfaces/property.interface";

const ViewPropertyPage = () => {
  const [property, setProperty] = useState<Property | null>(null);
  const searchParams = useSearchParams();
  const propertyId = searchParams.get("id");

  useEffect(() => {
    const fetchProperty = async () => {
      if (propertyId) {
        const data = await getPropertyById(propertyId);
        setProperty(data);
      }
    };
    fetchProperty();
  }, [propertyId]);

  if (!property) return <div className={styles.loading}>Cargando propiedad...</div>;

  return (
    <>
      <Navbar />
      <main className={styles.propertyContainer}>
        <h2 className={styles.title}>{property.name}</h2>

        <div className={styles.imageGallery}>
          {property.photos?.length ? (
            property.photos.map((url, index) => (
              <img key={index} src={url} alt={`Foto ${index + 1}`} className={styles.image} />
            ))
          ) : (
            <div className={styles.imagePlaceholder}>IMAGEN</div>
          )}
        </div>

        <div className={styles.infoSection}>
          <p><strong>Tipo:</strong> {property.type}</p>
          <p><strong>Precio:</strong> Bs {property.price}</p>
          <p><strong>Ubicación:</strong> {property.location}</p>
          <p><strong>Descripción:</strong> {property.description}</p>
          <p><strong>Calificación:</strong> {"★".repeat(property.rating)}{"☆".repeat(5 - property.rating)}</p>
          <p><strong>Reseñas:</strong> {property.reviews} reseñas</p>
        </div>

        <div className={styles.contactButtons}>
          <button className={styles.contactButton}>CONTACTAR</button>
          <button className={styles.whatsappButton}>WHATSAPP</button>
        </div>

        <div className={styles.opinionSection}>
          <h3>Deja tu opinión</h3>
          <textarea placeholder="Escribe tu comentario..." className={styles.textarea} />
          <button className={styles.publishButton}>PUBLICAR</button>
        </div>
      </main>
    </>
  );
};

export default ViewPropertyPage;