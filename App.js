// App.js
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  Modal,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

// ================ DATA MODELS & CONTEXT ================
const GTDContext = React.createContext();

// ================ MAIN APP COMPONENT ================
export default function App() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [contexts, setContexts] = useState(['@computer', '@home', '@errands', '@phone', '@office']);

  // Sample data for demonstration
  useEffect(() => {
    setTasks([
      {
        id: '1',
        title: 'Review quarterly reports',
        status: 'inbox',
        context: null,
        projectId: null,
        completed: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        title: 'Call dentist for appointment',
        status: 'next-action',
        context: '@phone',
        projectId: null,
        completed: false,
        createdAt: new Date().toISOString(),
      },
    ]);

    setProjects([
      {
        id: '1',
        name: 'Website Redesign',
        description: 'Redesign company website with new branding',
        createdAt: new Date().toISOString(),
      },
    ]);
  }, []);

  const addTask = (title) => {
    const newTask = {
      id: Date.now().toString(),
      title,
      status: 'inbox',
      context: null,
      projectId: null,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks([...tasks, newTask]);
  };

  const updateTask = (taskId, updates) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    ));
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const addProject = (name, description) => {
    const newProject = {
      id: Date.now().toString(),
      name,
      description,
      createdAt: new Date().toISOString(),
    };
    setProjects([...projects, newProject]);
    return newProject.id;
  };

  const Tab = createBottomTabNavigator();
  const Stack = createStackNavigator();

  return (
    <GTDContext.Provider value={{
      tasks,
      projects,
      contexts,
      addTask,
      updateTask,
      deleteTask,
      addProject,
    }}>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: '#007AFF',
            tabBarInactiveTintColor: 'gray',
            headerShown: false,
          }}
        >
          <Tab.Screen 
            name="Inbox" 
            component={InboxScreen}
            options={{
              tabBarLabel: 'Inbox',
            }}
          />
          <Tab.Screen 
            name="NextActions" 
            component={NextActionsScreen}
            options={{
              tabBarLabel: 'Next Actions',
            }}
          />
          <Tab.Screen 
            name="Projects" 
            component={ProjectsScreen}
            options={{
              tabBarLabel: 'Projects',
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </GTDContext.Provider>
  );
}

// ================ INBOX SCREEN ================
function InboxScreen() {
  const { tasks, addTask, updateTask, deleteTask, projects, addProject, contexts } = React.useContext(GTDContext);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');

  const inboxTasks = tasks.filter(task => task.status === 'inbox');

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      addTask(newTaskTitle.trim());
      setNewTaskTitle('');
    }
  };

  const handleProcessTask = (task) => {
    setSelectedTask(task);
    setShowProcessModal(true);
  };

  const handleMoveToProject = (projectId) => {
    updateTask(selectedTask.id, { 
      status: 'project', 
      projectId: projectId 
    });
    setShowProcessModal(false);
    setSelectedTask(null);
  };

  const handleMakeNextAction = (context) => {
    updateTask(selectedTask.id, { 
      status: 'next-action', 
      context: context 
    });
    setShowProcessModal(false);
    setSelectedTask(null);
  };

  const handleCreateNewProject = () => {
    if (newProjectName.trim()) {
      const projectId = addProject(newProjectName.trim(), newProjectDescription.trim());
      handleMoveToProject(projectId);
      setNewProjectName('');
      setNewProjectDescription('');
      setShowNewProjectModal(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Inbox</Text>
        <Text style={styles.headerSubtitle}>Capture everything that comes to mind</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="What's on your mind?"
          value={newTaskTitle}
          onChangeText={setNewTaskTitle}
          onSubmitEditing={handleAddTask}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={inboxTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <View style={styles.taskContent}>
              <Text style={styles.taskTitle}>{item.title}</Text>
              <Text style={styles.taskDate}>
                {new Date(item.createdAt).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.taskActions}>
              <TouchableOpacity
                style={styles.processButton}
                onPress={() => handleProcessTask(item)}
              >
                <Text style={styles.processButtonText}>Process</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteTask(item.id)}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>Your inbox is empty!</Text>
            <Text style={styles.emptyStateSubtext}>
              Add new tasks, ideas, or to-dos above
            </Text>
          </View>
        }
      />

      {/* Process Task Modal */}
      <Modal
        visible={showProcessModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowProcessModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Process Task</Text>
            <Text style={styles.modalTaskTitle}>{selectedTask?.title}</Text>

            <Text style={styles.sectionTitle}>Move to Project:</Text>
            <ScrollView style={styles.projectsList}>
              {projects.map(project => (
                <TouchableOpacity
                  key={project.id}
                  style={styles.projectItem}
                  onPress={() => handleMoveToProject(project.id)}
                >
                  <Text style={styles.projectName}>{project.name}</Text>
                  <Text style={styles.projectDescription}>{project.description}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={styles.newProjectButton}
                onPress={() => setShowNewProjectModal(true)}
              >
                <Text style={styles.newProjectButtonText}>+ Create New Project</Text>
              </TouchableOpacity>
            </ScrollView>

            <Text style={styles.sectionTitle}>Make Next Action:</Text>
            <ScrollView style={styles.contextsList}>
              {contexts.map(context => (
                <TouchableOpacity
                  key={context}
                  style={styles.contextItem}
                  onPress={() => handleMakeNextAction(context)}
                >
                  <Text style={styles.contextText}>{context}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowProcessModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* New Project Modal */}
      <Modal
        visible={showNewProjectModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowNewProjectModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Project</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Project name"
              value={newProjectName}
              onChangeText={setNewProjectName}
            />
            
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Project description (optional)"
              value={newProjectDescription}
              onChangeText={setNewProjectDescription}
              multiline
              numberOfLines={3}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowNewProjectModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.createButton}
                onPress={handleCreateNewProject}
              >
                <Text style={styles.createButtonText}>Create & Move Task</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ================ NEXT ACTIONS SCREEN ================
function NextActionsScreen() {
  const { tasks, updateTask, contexts, projects } = React.useContext(GTDContext);
  const [selectedContext, setSelectedContext] = useState('all');
  const [selectedProject, setSelectedProject] = useState('all');

  const nextActionTasks = tasks.filter(task => task.status === 'next-action');

  const filteredTasks = nextActionTasks.filter(task => {
    const contextMatch = selectedContext === 'all' || task.context === selectedContext;
    const projectMatch = selectedProject === 'all' || task.projectId === selectedProject;
    return contextMatch && projectMatch;
  });

  const toggleTaskComplete = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    updateTask(taskId, { completed: !task.completed });
  };

  const getProjectName = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'No Project';
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Next Actions</Text>
        <Text style={styles.headerSubtitle}>
          {filteredTasks.length} tasks ready to do
        </Text>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[
              styles.filterChip,
              selectedContext === 'all' && styles.filterChipActive
            ]}
            onPress={() => setSelectedContext('all')}
          >
            <Text style={[
              styles.filterChipText,
              selectedContext === 'all' && styles.filterChipTextActive
            ]}>
              All Contexts
            </Text>
          </TouchableOpacity>
          {contexts.map(context => (
            <TouchableOpacity
              key={context}
              style={[
                styles.filterChip,
                selectedContext === context && styles.filterChipActive
              ]}
              onPress={() => setSelectedContext(context)}
            >
              <Text style={[
                styles.filterChipText,
                selectedContext === context && styles.filterChipTextActive
              ]}>
                {context}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.secondFilterRow}>
          <TouchableOpacity
            style={[
              styles.filterChip,
              selectedProject === 'all' && styles.filterChipActive
            ]}
            onPress={() => setSelectedProject('all')}
          >
            <Text style={[
              styles.filterChipText,
              selectedProject === 'all' && styles.filterChipTextActive
            ]}>
              All Projects
            </Text>
          </TouchableOpacity>
          {projects.map(project => (
            <TouchableOpacity
              key={project.id}
              style={[
                styles.filterChip,
                selectedProject === project.id && styles.filterChipActive
              ]}
              onPress={() => setSelectedProject(project.id)}
            >
              <Text style={[
                styles.filterChipText,
                selectedProject === project.id && styles.filterChipTextActive
              ]}>
                {project.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.taskItem, item.completed && styles.completedTask]}
            onPress={() => toggleTaskComplete(item.id)}
          >
            <View style={styles.checkbox}>
              {item.completed && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <View style={styles.taskContent}>
              <Text style={[
                styles.taskTitle,
                item.completed && styles.completedTaskTitle
              ]}>
                {item.title}
              </Text>
              <View style={styles.taskMeta}>
                {item.context && (
                  <Text style={styles.contextTag}>{item.context}</Text>
                )}
                {item.projectId && (
                  <Text style={styles.projectTag}>
                    {getProjectName(item.projectId)}
                  </Text>
                )}
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No next actions found</Text>
            <Text style={styles.emptyStateSubtext}>
              Process items from your inbox to see them here
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

// ================ PROJECTS SCREEN ================
function ProjectsScreen() {
  const { projects, tasks } = React.useContext(GTDContext);

  const getProjectTasks = (projectId) => {
    return tasks.filter(task => task.projectId === projectId);
  };

  const getProjectProgress = (projectId) => {
    const projectTasks = getProjectTasks(projectId);
    if (projectTasks.length === 0) return 0;
    const completedTasks = projectTasks.filter(task => task.completed).length;
    return Math.round((completedTasks / projectTasks.length) * 100);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Projects</Text>
        <Text style={styles.headerSubtitle}>
          {projects.length} active projects
        </Text>
      </View>

      <FlatList
        data={projects}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const projectTasks = getProjectTasks(item.id);
          const progress = getProjectProgress(item.id);
          
          return (
            <View style={styles.projectCard}>
              <View style={styles.projectHeader}>
                <Text style={styles.projectTitle}>{item.name}</Text>
                <Text style={styles.progressText}>{progress}%</Text>
              </View>
              
              {item.description && (
                <Text style={styles.projectDescription}>{item.description}</Text>
              )}
              
              <View style={styles.progressBar}>
                <View 
                  style={[styles.progressFill, { width: `${progress}%` }]} 
                />
              </View>
              
              <Text style={styles.taskCount}>
                {projectTasks.length} tasks • {projectTasks.filter(t => t.completed).length} completed
              </Text>
              
              <Text style={styles.projectDate}>
                Created {new Date(item.createdAt).toLocaleDateString()}
              </Text>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No projects yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Create projects when processing items from your inbox
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

// ================ STYLES ================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#007AFF',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#ffffff',
    marginTop: 6,
    opacity: 0.9,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: -20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    zIndex: 1,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e1e8ed',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
    color: '#2c3e50',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  addButton: {
    backgroundColor: '#28a745',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    marginLeft: 12,
    justifyContent: 'center',
    shadowColor: '#28a745',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  completedTask: {
    opacity: 0.7,
    borderLeftColor: '#28a745',
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#007AFF',
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9ff',
  },
  checkmark: {
    color: '#007AFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 6,
    lineHeight: 22,
  },
  completedTaskTitle: {
    textDecorationLine: 'line-through',
    color: '#95a5a6',
  },
  taskDate: {
    fontSize: 13,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  taskMeta: {
    flexDirection: 'row',
    marginTop: 6,
    flexWrap: 'wrap',
  },
  contextTag: {
    fontSize: 12,
    color: '#007AFF',
    backgroundColor: '#e8f4fd',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
    fontWeight: '600',
    overflow: 'hidden',
  },
  projectTag: {
    fontSize: 12,
    color: '#28a745',
    backgroundColor: '#e8f5e8',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
    fontWeight: '600',
    overflow: 'hidden',
  },
  taskActions: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  processButton: {
    backgroundColor: '#28a745',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 6,
    minWidth: 80,
    alignItems: 'center',
    shadowColor: '#28a745',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  processButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
    shadowColor: '#dc3545',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyStateText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#34495e',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '90%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2c3e50',
  },
  modalTaskTitle: {
    fontSize: 17,
    color: '#7f8c8d',
    marginBottom: 24,
    textAlign: 'center',
    fontStyle: 'italic',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 12,
    color: '#212529',
  },
  projectsList: {
    maxHeight: 120,
  },
  projectItem: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  projectName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#212529',
  },
  projectDescription: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 4,
  },
  newProjectButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  newProjectButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  contextsList: {
    maxHeight: 100,
  },
  contextItem: {
    backgroundColor: '#e3f2fd',
    padding: 10,
    borderRadius: 6,
    marginBottom: 6,
    alignItems: 'center',
  },
  contextText: {
    color: '#007AFF',
    fontWeight: '500',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: '#6c757d',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  createButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  filtersContainer: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 4,
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  secondFilterRow: {
    marginTop: 12,
  },
  filterChip: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    marginHorizontal: 6,
    marginLeft: 12,
    borderWidth: 1,
    borderColor: '#e1e8ed',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  filterChipActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  filterChipText: {
    color: '#7f8c8d',
    fontSize: 14,
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
  projectCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
    borderLeftWidth: 5,
    borderLeftColor: '#007AFF',
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  projectTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
    marginRight: 10,
  },
  progressText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#007AFF',
    backgroundColor: '#e8f4fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  projectDescription: {
    fontSize: 15,
    color: '#7f8c8d',
    marginBottom: 16,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#ecf0f1',
    borderRadius: 4,
    marginBottom: 16,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 4,
  },
  taskCount: {
    fontSize: 15,
    color: '#34495e',
    marginBottom: 8,
    fontWeight: '600',
  },
  projectDate: {
    fontSize: 13,
    color: '#95a5a6',
    fontWeight: '500',
  },
});