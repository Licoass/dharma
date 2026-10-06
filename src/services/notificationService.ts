import type { Task } from '../types';

class NotificationService {
  private notifiedTaskIds = new Set<string>();

  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window;
  }

  public getPermission(): NotificationPermission {
    if (!this.isSupported()) return 'denied';
    return Notification.permission;
  }

  public async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) return 'denied';
    try {
      const permission = await Notification.requestPermission();
      return permission;
    } catch (e) {
      console.warn('Error al solicitar permisos de notificación', e);
      return 'denied';
    }
  }

  public sendNotification(title: string, options?: NotificationOptions): boolean {
    if (!this.isSupported() || Notification.permission !== 'granted') {
      return false;
    }

    try {
      new Notification(title, {
        icon: '/icons/icon-192.png',
        badge: '/favicon.svg',
        ...options,
      });
      return true;
    } catch (e) {
      console.warn('Error al enviar notificación:', e);
      return false;
    }
  }

  public sendTestNotification(): boolean {
    return this.sendNotification('DHARMA — Notificación Activa', {
      body: 'Tu centro de mando está configurado para avisarte de tareas prioritarias y recordatorios.',
    });
  }

  /**
   * Revisa tareas pendientes y alerta si alguna vence hoy o está próxima
   */
  public checkDueTasks(tasks: Task[]) {
    if (!this.isSupported() || Notification.permission !== 'granted') return;

    const todayStr = new Date().toISOString().slice(0, 10);

    tasks.forEach((task) => {
      // Solo alertar si no está completada y no la hemos notificado en esta sesión
      if (this.notifiedTaskIds.has(task.id)) return;
      if (task.statusId === 'completado') return;

      const isDueToday = task.dueDate === 'Hoy' || task.dueDate === todayStr;
      const isHighPriority = task.priority === 'alta' || task.priority === 'vital';

      if (isDueToday && isHighPriority) {
        this.notifiedTaskIds.add(task.id);
        this.sendNotification(`Recordatorio DHARMA: ${task.title}`, {
          body: `Tarea prioritaria programada para hoy${task.dueTime ? ` a las ${task.dueTime}` : ''}.`,
          tag: `task-${task.id}`,
        });
      }
    });
  }
}

export const notificationService = new NotificationService();
