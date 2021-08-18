import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class SessionEntity {
  @PrimaryGeneratedColumn()
  public id: string;

  @Column()
  public userId: string;

  @Column()
  public refreshTokenHash: string;

  @Column()
  public expiresAt: Date;

  @Column()
  public revoked: boolean;

  @Column()
  public createdAt: Date;

  @Column()
  public updatedAt: Date;
}

export { SessionEntity };
