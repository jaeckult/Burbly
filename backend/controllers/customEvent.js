const express = require('express');
const customEventRouter = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { identifyUser } = require('../utils/middleware');

// GET /events — fetch all events including their tags
customEventRouter.get('/', async (req, res) => {
    
    
  try {
    const events = await prisma.event.findMany({
      include: {
        EventTag: {
          include: {
            tag: true
          }
        },
        createdBy: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      }
    });

    // Flatten tags into an array of tag names
    const formattedEvents = events.map(event => ({
      ...event,
      tags: event.EventTag.map(et => et.tag.name),
      EventTag: undefined // remove raw relation from response
    }));
    
    console.log('Found events:', formattedEvents.length)
    console.log('Sending response:', { events: formattedEvents })
    
    res.json({ events: formattedEvents });
  } catch (error) {
    console.error('Failed to fetch events:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /events — create a new event and connect or create tags
customEventRouter.post('/', identifyUser, async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      location,
      price,
      tags = [],       // array of tag names
      mood,
      startTime,
      endTime,
      imageUrl
    } = req.body;

    const newEvent = await prisma.event.create({
      data: {
        title,
        description,
        category,
        location,
        price,
        mood,
        startTime: new Date(startTime),
        endTime: endTime ? new Date(endTime) : null,
        imageUrl,
        createdBy: {
          connect: { id: req.user.id }
        },
        EventTag: {
          create: tags.map(tagName => ({
            tag: {
              connectOrCreate: {
                where: { name: tagName },
                create: { name: tagName }
              }
            }
          }))
        }
      },
      include: {
        EventTag: {
          include: {
            tag: true
          }
        }
      }
    });

    const formattedEvent = {
      ...newEvent,
      tags: newEvent.EventTag.map(et => et.tag.name),
      EventTag: undefined
    };

    res.status(201).json(formattedEvent);
  } catch (error) {
    console.error('Failed to create event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = customEventRouter;
