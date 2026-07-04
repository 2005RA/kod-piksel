import { Navigate, useLocation } from 'react-router-dom';
import { useRewards } from '../context/RewardContext';

// Wraps lesson routes. Guests can work through lessons freely; once their
// local (localStorage) progress hits the guest level cap, send them to
// register so future progress gets saved to an account instead of being
// stuck on-device. Their progress up to this point is preserved and gets
// merged into the new profile as soon as they sign up (see RewardContext).
export default function LevelGate({ children }) {
  const { guestLocked } = useRewards();
  const location = useLocation();

  if (guestLocked) {
    return <Navigate to="/register" replace state={{ reason: 'level3', from: location.pathname }} />;
  }
  return children;
}
