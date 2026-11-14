import { findNavItem } from './navigation';

describe('findNavItem (breadcrumb)', () => {
  it('matches the dashboard only on "/"', () => {
    expect(findNavItem('/')?.item.label).toBe('Tableau de bord');
  });

  it('prefers the longest matching route', () => {
    const match = findNavItem('/passengers/reservations/5');
    expect(match?.item.label).toBe('Réservations');
    expect(match?.section.title).toBe('Passagers et billets');
  });

  it('maps the passenger edit page to "Passagers"', () => {
    expect(findNavItem('/passengers/12/modifier')?.item.label).toBe('Passagers');
  });

  it('ignores query parameters', () => {
    expect(findNavItem('/passengers/reclamations/nouvelle?passagerId=1')?.item.label).toBe('Réclamations');
  });
});
