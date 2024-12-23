import OtpRepository from '../../repositories/otp/otp.repository';

import type { OtpDoc } from '../../models/otp/otp.model';
import type { UserDbDoc } from '../../schemas/user/user.schema';

const createOtp = async ({ user, otp }: { user: UserDbDoc; otp: string | number }): Promise<OtpDoc> =>
  OtpRepository.create({
    otp,
    user,
  });

const verifyOtp = async ({ user, otp }: { user: UserDbDoc; otp: string | number }): Promise<OtpDoc | null> =>
  OtpRepository.findOne({
    otp,
    user: user._id,
  });

const OtpService = {
  createOtp,
  verifyOtp,
};

export default OtpService;
