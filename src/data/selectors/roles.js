// DELETE THIS FILE LATER
import { StrictDict } from 'utils';

const canUserViewGradebook = ({ roles }) => !!roles.canUserViewGradebook;

export default StrictDict({
  canUserViewGradebook,
});
