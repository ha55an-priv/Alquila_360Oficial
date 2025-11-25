"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./page.module.css";
import Navbar from "@/components/Navbar";
import { getTenantContractById } from "@/app/services/tenant-contract.service";
import { TenantContractDetail } from "@/app/interfaces/tenant-contract.interface";

const ViewTenantContractPage = () => {
  const [contract, setContract] = useState<TenantContractDetail | null>(null);
  const searchParams = useSearchParams();
  const contractId = searchParams.get("id");

  useEffect(() => {
    const fetchContract = async () => {
      if (contractId) {
        const data = await getTenantContractById(contractId);
        setContract(data);
      }
    };
    fetchContract();
  }, [contractId]);

  if (!contract) return <div className={styles.loading}>Cargando contrato...</div>;

  return (
    <>
      <Navbar />
      <main className={styles.contractContainer}>
        <h2 className={styles.title}>DOCUMENTO DIGITAL</h2>

        <div className={styles.contractInfo}>
          <p><strong>Nombre de la Propiedad:</strong> {contract.propertyName}</p>
          <p><strong>Precio:</strong> Bs {contract.price}</p>
          <p><strong>Propietario:</strong> {contract.ownerName}</p>
          <p><strong>Dirección:</strong> {contract.address}</p>
          <p><strong>Inicio / Fin:</strong> {contract.startDate} / {contract.endDate}</p>
          <p><strong>Descripción del contrato:</strong> {contract.description}</p>
        </div>

        <div className={styles.actionButtons}>
          <button className={styles.backButton}>VOLVER A LISTA DE CONTRATOS</button>
          <button className={styles.downloadButton}>DESCARGAR CONTRATO</button>
        </div>
      </main>
    </>
  );
};

export default ViewTenantContractPage;