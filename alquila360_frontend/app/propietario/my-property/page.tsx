"use client";

import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import Navbar from "@/components/PropNavbar";
import { getOwnerProperties } from "@/app/services/property.service";
import { Property } from "@/app/interfaces/property.interface";

const OwnerPropertiesPage = () => {
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    const fetchProperties = async () => {
      const data = await getOwnerProperties();
      setProperties(data);
    };
    fetchProperties();
  }, []);

  return (
    <>
      <Navbar />
      <main className={styles.pageContainer}>
        <h2 className={styles.pageTitle}>Mis Propiedades Publicadas</h2>

        {properties.length === 0 ? (
          <p className={styles.emptyMessage}>No tienes propiedades registradas aún.</p>
        ) : (
          <div className={styles.propertyList}>
            {properties.map((prop) => (
              <div key={prop.id} className={styles.propertyCard}>
                <div className={styles.imagePlaceholder}>
                  {prop.photos ? (
                    <img /*src={prop.photos} alt="Imagen propiedad" className={styles.image} *//>
                  ) : (
                    <span>IMAGEN</span>
                  )}
                </div>

                <div className={styles.propertyInfo}>
                  <p><strong>Tipo:</strong> {prop.type}</p>
                  <p><strong>Nombre:</strong> {prop.name}</p>
                  <p><strong>Precio:</strong> Bs {prop.price}</p>
                  <p><strong>Descripción:</strong> {prop.description}</p>
                </div>

                <div className={styles.ratingSection}>
                  <p><strong>Calificación:</strong> {"★".repeat(prop.rating)}{"☆".repeat(5 - prop.rating)}</p>
                  <p><strong>Reseñas:</strong> {prop.reviews} reseñas</p>
                </div>

                <div className={styles.actionButtons}>
                  <button className={styles.viewButton}>VER PROPIEDAD</button>
                  <button className={styles.editButton}>EDITAR PROPIEDAD</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
};

export default OwnerPropertiesPage;