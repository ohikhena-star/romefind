import { Request, Response } from 'express';
import { prisma } from '../../config/prisma.js';

export async function getOrganizations(_req: Request, res: Response): Promise<void> {
  try {
    const organizations = await prisma.organization.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { opportunities: true }
        }
      }
    });

    res.json({
      organizations: organizations.map(org => ({
        id: org.id,
        name: org.name,
        description: org.description,
        website: org.website,
        logo: org.logo,
        country: org.country,
        verificationStatus: org.verificationStatus,
        opportunityCount: org._count.opportunities
      }))
    });
  } catch (error) {
    console.error('getOrganizations error:', error);
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Failed to retrieve organizations' } });
  }
}

export async function getOrganizationById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const organization = await prisma.organization.findUnique({
      where: { id },
      include: {
        opportunities: {
          where: { status: 'OPEN' }
        }
      }
    });

    if (!organization) {
      res.status(404).json({ error: { code: 'ORGANIZATION_NOT_FOUND', message: 'Organization not found' } });
      return;
    }

    res.json({ organization });
  } catch (error) {
    console.error('getOrganizationById error:', error);
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Failed to retrieve organization' } });
  }
}
