export interface UserEntity {
    id: number;
    name: string;
    lastname: string;
    email: string;
    createdAt: Date;
    active: boolean;
    roleId: number;
    sectorId: number;
}

