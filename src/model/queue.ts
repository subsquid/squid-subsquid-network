import {
  Entity as Entity_,
  PrimaryColumn as PrimaryColumn_,
  JSONColumn as JSONColumn_,
} from '@subsquid/typeorm-store';

@Entity_()
export class Queue<T = unknown> {
  constructor(props?: Partial<Queue<T>>) {
    Object.assign(this, props);
  }

  @PrimaryColumn_()
  id!: string;

  @JSONColumn_({ array: true })
  tasks!: T[];
}
