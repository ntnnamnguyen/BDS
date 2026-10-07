import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateLeadDto } from './create-lead.dto.js';

describe('CreateLeadDto', () => {
  it('rejects a whitespace-only full name after trimming', async () => {
    const dto = plainToInstance(CreateLeadDto, {
      fullName: '   ',
      phone: '0901234567',
    });

    const errors = await validate(dto);

    expect(errors.some((error) => error.property === 'fullName')).toBe(true);
    expect(dto.fullName).toBe('');
  });
});
