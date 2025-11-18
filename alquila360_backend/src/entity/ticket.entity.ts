import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "Ticket" })
export class Ticket {
  @PrimaryGeneratedColumn({ name: "Id_Ticket" })
  Id_Ticket!: number;

  @Column({ name: "Id_Propiedad", type: "int" })
  Id_Propiedad!: number;

  @Column({ name: "Id_Inquilino", type: "int" })
  Id_Inquilino!: number;

  @Column({ name: "Descripcion", type: "nvarchar", length: 300, nullable: true })
  Descripcion!: string | null;

  @Column({ name: "Fecha_Reporte", type: "date" })
  Fecha_Reporte!: Date;

  @Column({ name: "Estado", type: "nvarchar", length: 50, nullable: true })
  Estado!: string | null;

  @Column({ name: "Fecha_Resolucion", type: "date", nullable: true })
  Fecha_Resolucion!: Date | null;

  @Column({ name: "Tiempo_Resolucion_Horas", type: "int", nullable: true })
  Tiempo_Resolucion_Horas!: number | null;

  @Column({ name: "Fotos", type: "json", nullable: true })
  Fotos!: string[] | null;
}
