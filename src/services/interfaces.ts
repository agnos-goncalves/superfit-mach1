// DTO data object transfer
export interface InterfaceCrud<DTO> {
  getAll(): Promise<DTO[]>;
  find(id: string): Promise<DTO>;
  create(payload: DTO): Promise<DTO>;
  update(id: string, payload: DTO): Promise<DTO>;
}
