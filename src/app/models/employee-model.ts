export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  phone: string;
  gender: string;
  dateOfBirth: string;

  roleId: number;
  departmentId: number;
  positionId: number;

  salary: number;
  hireDate: string;
  status: boolean;
  photo: string;
}

export interface Role{
  id: number,
  name: string,
  description: string
}

export interface Department{
  id: number,
  name: string,
  description: string
}

export interface Position{
  id: number,
  name: string,
  description: string
}