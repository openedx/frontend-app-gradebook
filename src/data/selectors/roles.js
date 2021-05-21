import { StrictDict } from 'utils';

const canUserViewGradebook = ({ roles }) => !!roles.canUserViewGradebook;

export default StrictDict({
  canUserViewGradebook,
});
