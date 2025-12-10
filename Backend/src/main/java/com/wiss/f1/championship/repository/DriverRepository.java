package com.wiss.f1.championship.repository;
import com.wiss.f1.championship.entity.Driver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DriverRepository extends JpaRepository<Driver, Long> {
    
    Optional<Driver> findByName(String name);
}
