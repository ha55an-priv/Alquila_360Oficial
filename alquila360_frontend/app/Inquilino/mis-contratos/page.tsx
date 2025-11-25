"use client";

import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import Navbar from "@/components/Navbar";
import { getTenantContracts } from "@/app/services/tenant-contract.service";
import { TenantContract } from "@/app/interfaces/tenant-contract.interface";

const TenantContractsPage = () => {
  const [contracts, setContracts] = useState<TenantContract[]>([]);

  useEffect(() => {
    const fetchContracts = async () => {
      const data = await getTenantContracts();
      setContracts(data);
    };
    fetchContracts();
  }, []);

  return (
    <>
      <Navbar />
      <main className={styles.pageContainer}>
        <h2 className={styles.pageTitle}>Mis Contratos</h2>

        {contracts.length === 0 ? (
          <p className={styles.emptyMessage}>No tienes contratos registrados aún.</p>
        ) : (
          <div className={styles.contractList}>
            {contracts.map((contract) => (
              <div key={contract.id} className={styles.contractCard}>
                <div className={styles.documentLabel}>DOCUMENTO DIGITAL</div>

                <div className={styles.contractInfo}>
                  <p><strong>ID Contrato:</strong> {contract.id}</p>
                  <p><strong>Propiedad:</strong> {contract.propertyName}</p>
                  <p><strong>Precio:</strong> Bs {contract.price}</p>
                  <p><strong>Propietario:</strong> {contract.ownerName}</p>
                  <p><strong>Inicio / Fin:</strong> {contract.startDate} / {contract.endDate}</p>
                </div>

                <div className={styles.actionButtons}>
                  <button className={styles.viewButton}>VER CONTRATO</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
};

export default TenantContractsPage;