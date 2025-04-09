import { StrictDict } from '@src/utils';

const canUserViewGradebook = ({ roles }) => !!roles.canUserViewGradebook;

export default StrictDict({
  canUserViewGradebook,
});
