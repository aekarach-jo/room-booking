import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'YOUR_SECRET_KEY', // TODO: use environment variable
    });
  }

  async validate(payload: any) {
    // The payload is the decoded JWT, which includes the user's username and ID.
    // We can use this to fetch the full user object if needed.
    // For now, we'll just return the payload.
    return { id: payload.sub, username: payload.username, role: payload.role };
  }
}
