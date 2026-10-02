import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class EmployeeService {

    private final EmployeeRepository repository;

    public EmployeeService(EmployeeRepository repository) {
        this.repository = repository;
    }

    public List<Employee> getAllEmployees() {
        return repository.findAll();
    }

    public Employee getEmployee(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
    }

    public Employee createEmployee(Employee employee) {
        return repository.save(employee);
    }

    public Employee updateEmployee(Long id, Employee updated) {
        Employee employee = getEmployee(id);

        employee.setName(updated.getName());
        employee.setEmail(updated.getEmail());
        employee.setDepartment(updated.getDepartment());
        employee.setPhone(updated.getPhone());
        employee.setSalary(updated.getSalary());

        return repository.save(employee);
    }

    public void deleteEmployee(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Employee not found");
        }
        repository.deleteById(id);
    }

    public List<Employee> search(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return repository.findAll();
        }

        return repository.findByNameContainingIgnoreCaseOrDepartmentContainingIgnoreCase(
                keyword.trim(), keyword.trim());
    }
}
